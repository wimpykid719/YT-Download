import sys, os
if getattr(sys, 'frozen', False):#バンドルされたファイルによる実行の場合app・exe
	sys._MEIPASS = os.path.dirname(sys.executable)#sys.executableの上にあるフォルダパスを取得してる。
import eel
# import logging
import requests
import urllib.parse
from pytube import YouTube
from modules import YT_Download
from modules import meta_song
from modules import createlog

#ファイルを生成しようとする段階でエラーが起きる。
path = 'test.txt'
f = open(path)
print(type(f))
f.close()


lg = createlog.get_logger(__name__, 'log.txt')
lg.debug('ロギング 開始')


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
	try:
		print(os.getcwd())
		path = f'web/images/thumbnail/{videoID}.jpg'
		url = f'https://img.youtube.com/vi/{videoID}/maxresdefault.jpg'
		res = requests.get(url, stream=True)
		if res.status_code == 200:
			with open(path, 'wb') as f:
				f.write(res.content)
			return path.replace('web/', '')#index.htmlから見たパス。
		else:
			url = f'https://img.youtube.com/vi/{videoID}/hqdefault.jpg'
			res = requests.get(url)
			if res.status_code == 200:
				with open(path, 'wb') as f:
					f.write(res.content)
				return path.replace('web/', '')
			else:
				return 'images/14ver1.jpg'
	except:
		lg.exception(sys.exc_info())

@eel.expose
def write_song_data(urls, songDatasDict):
	meta_song.writeMusicData(urls, songDatasDict)



# 最初に表示するhtmlページ
eel.start('index.html')