from pytube import YouTube
import os
import ffmpeg

import eel

# ウエブコンテンツを持つフォルダー
eel.init('web')
# 最初に表示するhtmlページ
#eel.start('html/index.html')

#url = 'https://www.youtube.com/watch?v=vUQfJIsTbJI'

class Downloader():
	"""docstring for Youtubehq"""
	def __init__(self, url):
		yt = YouTube(url)
		self.title = yt.title
		self.alltag = yt.streams
		self.yt = yt
		print(self.title)
		# print(self.alltag)
	
	def makelist(self):
		alltag = self.alltag
		tags = {}
		tags_list = []
		audios = []
		videos = []

		for tag in alltag:
			
			tags['itag'] = tag.itag
			tags['mime_type'] = tag.mime_type
			tags['res'] = tag.resolution
			tags['abr'] = tag.abr
			tags['fps'] = tag.fps
			tags['vcodec'] = tag.video_codec
			tags['acodec'] = tag.audio_codec
			tags['file_type'] = tag.type
			
			tags_list.append(tags.copy())
			
		for tags in tags_list:
			if tags['file_type'] == 'audio':
				audios.append(tags.copy())

			if tags['file_type'] == 'video':
				videos.append(tags.copy())
		
		self.audios = audios
		self.videos = videos

	def select_mobile_v(self):#まずはmp4である事かつそのなかで一番大きい
		videos = self.videos
		hq_mobile_v = 0
		for video in videos:
			if video['mime_type'].split('/')[1] == 'mp4':
				if video['res']:
					if hq_mobile_v < int(video['res'][:-1]):
							hq_mobile_v = int(video['res'][:-1])
							video_mobile = video
		print(video_mobile)
		self.video_hq = video_mobile

	
	def select_hq_v(self):
		videos = self.videos
		hq_v60 = 0
		hq_v = 0
		video_hq = {}
		video_hq60 = None
		for video in videos:
			#resでかぶるからそれより前で処理する。
			if video['res'] is not None:
				if int(video['fps']) == 60: #resが2160以上が出てこないと変な感じになる。30fpsと重なってif 60 == 60:とかがいいかも
					if hq_v60 < int(video['res'][:-1]):
						hq_v60 = int(video['res'][:-1])
						video_hq60 = video
				elif hq_v < int(video['res'][:-1]):
					hq_v = int(video['res'][:-1])
					video_hq = video
		if video_hq60:
			self.video_hq = video_hq60
		else:
			self.video_hq = video_hq
		print(self.video_hq)

	
	def select_hq_a(self):
		audios = self.audios
		hq_a = 0
		audio_hq = {}
		for audio in audios:
			if audio['abr'] is not None:
				if hq_a < int(audio['abr'][:-4]):
					hq_a = int(audio['abr'][:-4])
					audio_hq = audio
		print(audio_hq)
		self.audio_hq = audio_hq


	def download_itag(self):
		yt = self.yt
		itag_v = self.video_hq['itag']
		
		itag_a = self.audio_hq['itag']
		
		if not os.path.exists('video/original'):
			os.makedirs('video/original')
		yt.streams.get_by_itag(itag_v).download('video/original')

		if not os.path.exists('audio/webm'):
			os.makedirs('audio/webm')
		yt.streams.get_by_itag(itag_a).download('audio/webm')

	def join_audio_video(self):
		title = self.title
		video_hq = self.video_hq
		audio_hq = self.audio_hq
		mime_type_v = video_hq['mime_type']
		mime_type_a = audio_hq['mime_type']
		# titleの最後が.の場合は.を付けない。
		if title[-1] != '.':
			videopath = 'video/original/' + title + '.' + mime_type_v.split('/')[1]
			audiopath = 'audio/webm/' + title + '.' + mime_type_a.split('/')[1]
		else:
			videopath = 'video/original/' + title + mime_type_v.split('/')[1]
			audiopath = 'audio/webm/' + title + mime_type_a.split('/')[1]
		
		# opus to aac
		if not os.path.exists('audio/aac'):
			os.mkdir('audio/aac')

		if title[-1] != '.':
			title_aac = 'audio/aac/' + title + '.' + 'm4a'
		else:
			title_aac = 'audio/aac/' + title + 'm4a'
		instream_a = ffmpeg.input(audiopath)
		stream = ffmpeg.output(instream_a, title_aac, audio_bitrate=160000, acodec="aac")
		ffmpeg.run(stream, overwrite_output=True)

		# join h264 and aac
		if video_hq['acodec'] is None: #これのおかげで音付きの動画の場合はエンコードかからない。
			if not os.path.exists('video/joined'):
				os.mkdir('video/joined')
			if title[-1] != '.':
				title_join = 'video/joined/' + title + '.' + 'mp4'
			else:
				title_join = 'video/joined/' + title + 'mp4'
			instream_v = ffmpeg.input(videopath)
			instream_a = ffmpeg.input(title_aac)
			stream = ffmpeg.output(instream_v, instream_a, title_join, vcodec='copy', acodec='copy') #vcodec='h264'にすればエンコードしてくれる。
			ffmpeg.run(stream, overwrite_output=True)

			
Downloader = Downloader('https://www.youtube.com/watch?v=3df83nUZxFk')

eel.start('index.html', close_callback=print(Downloader.title))

# Downloader.makelist()
# Downloader.select_mobile_v()
# Downloader.select_hq_a()
# Downloader.download_itag()
# Downloader.join_audio_video()

# https://www.youtube.com/watch?v=vUQfJIsTbJI スカー
# https://www.youtube.com/watch?v=rjyi3K8LeQ0 2秒2K
# https://www.youtube.com/watch?v=zCLOJ9j1k2Y&t=2s 4K動画

# cipherの値が変わった問題　https://github.com/nficano/pytube/issues/642　済み
# 辞書型の解決策がここにあったhttps://gist.github.com/dogrunjp/9748789　済み
# タイトルがYouTubeになる https://github.com/nficano/pytube/issues/632　済み
# パスを指定するならdownload(./video)のように指定する。　済み
# タイトル最後に.が入る時エラーが発生する。もしドットが後半に続くなら 済み
# 元々音声ファイルが合成されていると音が二重になる。 viedoのacodecがNoneじゃなければ合成しない。だけど音声ファイルはaacへ 済み
# webm動画・音声, MP4それぞれフォルダを分けたい。あと合成したあとのファイルも #音声ファイルをaacに変換してから合成したい　済み
# 60fpsの場合はどうする。　済み
# 最後の文字がドットじゃない場合はドットを足す。　済み
# copyだけだとvp9がmp4に入っててipadでは再生出来んな http://tech.ckme.co.jp/ffmpeg_vcodec.shtml 済みだけど、エンコードはかなりの時間かかる。実用的出ない。
# 音質は160kpなのか？ 済み
# 他の人のパソコンでも動作するように相対的なパスを指定
# 上書きの際y/nと聞かれてプログラムストップ　済み
# 画質は8Kだけど2160pと表示されるあと最高画質はitag272で決まっているおそらく、音声は251がおそらく最高 https://github.com/nficano/pytube/issues/304 どっかでダブってる 
# もし動画で使用したいならMP4で画質が高いのをダウンロードするようにする。済み

# lany https://www.youtube.com/watch?v=iPMp-TP3ODg
# lany cover https://www.youtube.com/watch?v=K3xbUe_spgA