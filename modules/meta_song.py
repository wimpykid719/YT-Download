import requests
import json
import asyncio
from mutagen.mp4 import MP4

# yt = YouTube("https://www.youtube.com/watch?v=3hPI3xjsNKE")
# m4a_path = "BASI_愛のままに_feat唾奇_Official_Music_Video.m4a"

# # print(yt.metadata[0])
# print(yt.metadata[0]['Artist'])
# print(yt.metadata[0]['Song'])#ない場合は曲名と同じになる。

# artist = yt.metadata[0]['Artist']
# song = yt.metadata[0]['Song']

class addMusicData():
	def __init__(self, songName, artistName):
		#Youtubeから取得した情報
		self.songNameYt = songName
		self.artistNameYt = artistName

		#iTunesのAPIで検索する。
		self.dataJp, self.dataEn = self.get_filtered_songData(songName, artistName)
		print(f'返ってきた：{self.dataJp}')
		print(f'返ってきた：{self.dataEn}')
	
	def get_filtered_songData(self, songName, artistName):
		datasJp = []
		datasEn = []
		async def main_loop(urls):
			async def get_songData(url):
				headers = {"content-type": "application/json"}
				response = await self.loop.run_in_executor(None, requests.get, url, headers)
				data = response.json()
				return data["results"]
			
			tasks = [get_songData(url) for url in urls]
			return await asyncio.gather(*tasks)
		
		def squeeze_data(song_data, artistName):
			if song_data[0]["artistName"].lower() == artistName.lower():
				return song_data[0]

		urls = [f'https://itunes.apple.com/search?term={songName}&media=music&entity=song&country=jp&lang=ja_jp&limit=10', f'https://itunes.apple.com/search?term={songName}&media=music&entity=song&limit=10']
		self.loop = asyncio.new_event_loop()
		datas = self.loop.run_until_complete(main_loop(urls))
		for data in datas:
			data = squeeze_data(data, artistName)
			if data:
				if data['country'] == 'JPN':
					datasJp.append(data)
				else:
					datasEn.append(data)
					print(f'ここで英語：{datasEn}')
		
		return datasJp, datasEn
	
	def take_some_song_info(self, songData):
		data = songData[0]
		songName = data['trackName']
		artistName = data['artistName']
		album = data['collectionName'] 
		category = data['primaryGenreName']
		year = data['releaseDate'][0:4]
		
		return songName, artistName, album, category, year
	
	def make_songData_dic(self, songName, artistName, album, category, year):
		song_n_a_a_c_y = {}
		song_n_a_a_c_y = {'name': songName, 'artist': artistName, 'album': album, 'category': category, 'year': year}
		return song_n_a_a_c_y

	def make_songData(self):
		songData = {}
		if self.dataJp:
			songData['JPN'] = self.make_songData_dic(*self.take_some_song_info(self.dataJp))
		else:
			songData['JPN'] = {}

		if self.dataEn:
			songData['USA'] = self.make_songData_dic(*self.take_some_song_info(self.dataEn))
		else:
			songData['USA'] = {}

		return songData
	
	# def add_songData(self):



# headers = {"content-type": "application/json"}
# urlJa = f'https://itunes.apple.com/search?term={song}&media=music&entity=song&country=jp&lang=ja_jp&limit=10'
# urlEn = f'https://itunes.apple.com/search?term={song}&media=music&entity=song&limit=10'

# response = requests.get(urlEn, headers=headers)
# data = response.json()
# song_datas = data["results"]

# for song_data in song_datas:
# 	if song_data["artistName"].lower() == artist.lower():
# 		print(song_data)
# 		m4a_video_tags = MP4(m4a_path)
# 		print(f'前半：{m4a_video_tags}')
# 		m4a_video_tags['\xa9nam'] = song_data['trackName']
# 		m4a_video_tags['\xa9alb'] = song_data['collectionName']
# 		m4a_video_tags['\xa9ART'] = song_data['artistName']
# 		m4a_video_tags['\xa9day'] = song_data['releaseDate'][0:4]
# 		# m4a_video_tags['\xa9lyr'] = lyric
# 		# m4a_video_tags['covr'] = cover_art
# 		m4a_video_tags['\xa9gen'] = song_data['primaryGenreName']
# 		print(f'後半：{m4a_video_tags}')
# 		m4a_video_tags.save()




"""
{'Song': "CAN'T GET OVER YOU (feat. Clams Casino)", 'Artist': 'Joji', 'Album': "CAN'T GET OVER YOU (feat. Clams Casino)", 'Licensed to YouTube by': 'WMG (on behalf of 88rising Music/12Tone Music, LLC); UMPG Publishing, Kobalt Music Publishing, Warner Chappell, CMRRA, UMPI, ASCAP, Sony ATV Publishing, LatinAutor - SonyATV, LatinAutorPerf, SOLAR Music Rights Management, UNIAO BRASILEIRA DE EDITORAS DE MUSICA - UBEM, AMRA, and 14 Music Rights Societies'}
Joji
CAN'T GET OVER YOU (feat. Clams Casino)
"""

"""
必要な情報

曲
アーティスト
アルバム
アルバムアーティスト：なくて良い
作曲者：なくて良い
ジャンル：なくて良い
年：なくて良い
アートワーク
歌詞

"""

#iTunes API
# https://itunes.apple.com/search?term=prettyboy&media=music&entity=song&limit=10