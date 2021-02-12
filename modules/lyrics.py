import re
import asyncio
import requests
from urllib.parse import quote
from bs4 import BeautifulSoup, Comment


#Lyrics__Container-sc-1ynbvzw-2

class Lyric():
	def __init__(self, artist, song_name, max_recur=2):
		song_name = re.sub("\(.+?\)", "", song_name)
		song_name = song_name.replace("'", "")
		# 先頭末尾の空白等削除
		song_name = song_name.strip()

		self.artist = artist
		self.song_name = song_name
		self.lyric = ''
		self.__gtask = []
		self.__canceled = False
		self.__lyric_genius = ''
		#何回再帰的に行うか。リクエスト5と再帰3で合計15回までリクエストを投げる。
		self.__max_recur = max_recur
		self.genius_url = self.make_genius_url(artist, song_name)
		self.azlyrics_url = self.make_azlyrics_url(artist, song_name)
		self.j_lyric_search_url = self.make_j_lyric_url(artist, song_name)
		self.j_lyruc_url = self.search_j_lyric_url(self.j_lyric_search_url)
		
		if self.j_lyruc_url:
			self.lyric = self.scrape_j_lyric(self.j_lyruc_url)
		else:
			print('日本語での曲情報は見つかりませんでした。')

		if not self.lyric:
			self.lyric = self.scrape_azlyrics(self.azlyrics_url)
		
		if not self.lyric:
			self.lyric = self.lyric_from_genius(self.genius_url, self.__max_recur)
		
		if not self.lyric:
			print('3つのサイトから歌詞を取得出来ませんでした。')
		
		

	def get_soup(self, url):
		r = requests.get(url)
		if r.status_code == 200:
			soup = BeautifulSoup(r.content, 'lxml')
			return soup
		else:
			return False
	
	def make_genius_url(self, artist, song_name):
		search_song = f'{artist} {song_name}'
		search_song = search_song.replace(' ', '-')
		return f'https://genius.com/{search_song}-lyrics'
	
	def make_azlyrics_url(self, artist, song_name):
		artist = artist.replace(' ', '')
		artist = artist.lower()
		song_name = song_name.replace(' ', '')
		song_name = song_name.lower()
		return f'https://www.azlyrics.com/lyrics/{artist}/{song_name}.html'
	
	def make_j_lyric_url(self, artist, song_name):
		song_name = quote(song_name)
		artist = quote(artist)
		return f'https://search2.j-lyric.net/index.php?kt={song_name}&ct=2&ka={artist}&ca=2&kl=&cl=2'

	def search_j_lyric_url(self, url):
		soup = self.get_soup(url)
		status_bdycs = soup.select('.bdyc')
		for element in status_bdycs:
			if element.text == '見つかりませんでした。':
				print('終了します。')	
				return False
		
		bdy_soup = soup.select('.bdy')
		song_soup_a = bdy_soup[0].select('.mid > a')
		artist_soup_a = bdy_soup[0].select('.sml > a')
		song_name_j_lyric = song_soup_a[0].text
		artist_j_lyric = artist_soup_a[0].text
		if song_name_j_lyric.lower() == self.song_name.lower() and artist_j_lyric.lower() == self.artist.lower():
			song_url = song_soup_a[0]['href']
			return song_url

	
	
	def scrape_genius(self, url):
		if not self.__canceled:
			soup = self.get_soup(url)
		if soup and not self.__canceled:
			lyric_soup = soup.select('.song_body-lyrics .lyrics p')
			if lyric_soup:
				self.__canceled = True
				tags = lyric_soup[0].find_all(['a', 'i'])
				for tag in tags:
					tag.unwrap()
				self.__lyric_genius = lyric_soup[0].text
				self.__gtask.cancel()
			else:
				print('歌詞情報を取得出来なかった。')
		else:
			if self.__canceled:
				print('歌詞取得した')
			else:
				print('歌詞情報がない')
			self.__gtask.cancel()
		
	def scrape_azlyrics(self, url):
		soup = self.get_soup(url)
		if soup:
			lyric_soup = soup.select('body > div.container.main-page > div > div > div:nth-child(8)')
			if not lyric_soup:
				lyric_soup = soup.select('body > div.container.main-page > div > div > div:nth-child(10)')
			return lyric_soup[0].text

	def scrape_j_lyric(self, url):
		soup = self.get_soup(url)
		if soup:
			lyric_soup = soup.select('#Lyric')
			for element in lyric_soup[0].select('br'):
				element.replace_with('\n')
			
			return lyric_soup[0].text



	def lyric_from_genius(self, url, depth):
		print('再帰の回数確認depth: ', self.__max_recur - depth)
		print(url)

		async def main_loop(url):
			async def get_lyric_soup(url):
				await self.loop.run_in_executor(None, self.scrape_genius, url)
			
			#main_loopの処理
			tasks = [get_lyric_soup(url) for _ in range(5)]#ここでself.__gtaskを上書きしているのが原因だった
			self.__gtask = asyncio.gather(*tasks)
			return await self.__gtask
		try:
			self.loop = asyncio.get_event_loop()
			self.loop.run_until_complete(main_loop(url))
		except asyncio.CancelledError as e:
			print("*** CancelledError ***", e)
		finally:
			if self.__lyric_genius or depth <= 0:
				return self.__lyric_genius
			else:
				print('5回のリクエストで曲情報が取れなかった。')
				return self.lyric_from_genius(url, depth - 1)