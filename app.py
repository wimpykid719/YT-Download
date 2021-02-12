import eel
import base64
import requests
import urllib.parse
from pytube import YouTube
from modules import YT_Download


# ウエブコンテンツを持つフォルダー
eel.init('web')

@eel.expose
def dowload(urls, mode):
	print(f'読み込んだurls：{urls}')
	yt = YT_Download.Downloader(urls, mode)
	yt.multi_download()

@eel.expose
def get_title(url):
	qs = urllib.parse.urlparse(url).query
	videoID = urllib.parse.parse_qs(qs)['v'][0]
	url = f'https://www.youtube.com/watch?v={videoID}'
	title = YouTube(url).title
	return title

@eel.expose
def get_src(videoID):
	path = f'web/images/thumbnail/{videoID}.jpg'
	url = f'https://img.youtube.com/vi/{videoID}/maxresdefault.jpg'
	res = requests.get(url, stream=True)
	if res.status_code == 200:
		with open(path, 'wb') as f:
			f.write(res.content)
		return path.replace('web/', '')
	else:
		url = f'https://img.youtube.com/vi/{videoID}/hqdefault.jpg'
		res = requests.get(url)
		if res.status_code == 200:
			with open(path, 'wb') as f:
				f.write(res.content)
			return path.replace('web/', '')
		else:
			return 'images/14ver1.jpg'

@eel.expose
def write_song_data(urls, songDatasDict):
	print(urls)
	print(songDatasDict)
	base64data = songDatasDict[urls[0]]['userImage']
	img = base64.b64decode(base64data.encode())
	print(img)
	


# 最初に表示するhtmlページ
eel.start('index.html')