import eel
from modules import YT_Download

# ウエブコンテンツを持つフォルダー
eel.init('web')

@eel.expose
def dowload(urls):
	print(f'読み込んだurls：{urls}')
	yt = YT_Download.Downloader(urls)
	yt.multi_download()


# 最初に表示するhtmlページ
eel.start('index.html')