import os
import re
import eel
import sys
import time
import ffmpeg
import threading
import urllib.parse
from pytube import YouTube

import meta

class Downloader():
	"""docstring for Youtubehq"""
	def __init__(self, urls, mode):
		urls = [url for url in urls if url != '']
		self.urls = urls
		self.count = len(urls)
		self.percent = {}
		self.songDatas = {}
		self.lock = threading.Lock()
		self.mode = mode
		if mode == '1':
			self.number = 1
		else:
			self.number = 2
		self.desktop_path = os.path.normpath(os.path.expanduser("~/Desktop"))

	
	def makelist(self, alltag):
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
		
		return audios, videos

	def select_mobile_v(self, videos):#まずはmp4である事かつそのなかで一番大きい
		hq_mobile_v = 0
		for video in videos:
			if video['mime_type'].split('/')[1] == 'mp4':
				if video['res']:
					if hq_mobile_v < int(video['res'][:-1]):
							hq_mobile_v = int(video['res'][:-1])
							video_mobile = video
		print(video_mobile)
		return video_mobile

	
	def select_hq_v(self, videos):
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
			return video_hq60
		else:
			return video_hq

	
	def select_hq_a(self, audios):
		hq_a = 0
		audio_hq = {}
		for audio in audios:
			if audio['abr'] is not None:
				if hq_a < int(audio['abr'][:-4]):
					hq_a = int(audio['abr'][:-4])
					audio_hq = audio
		return audio_hq
	
	def show_progress_bar(self, stream, chunk, bytes_remaining):
		current = ((stream.filesize - bytes_remaining)/stream.filesize)
		with self.lock:
			self.percent[threading.currentThread().getName()] = current*100

	def remove_symbol(self, title):
		# titleに入る余分な記号を取り除く
		code_regex = re.compile('[!"#$%&\'\\\\()*+,-./:;<=>?@[\\]^_`{|}~「」〔〕“”〈〉『』【】＆＊・（）＄＃＠。、？！｀＋￥％]')
		clean_title = code_regex.sub('', title)
		title = re.sub(r'\s+', "_", clean_title)
		return title
		
	def download_audio(self, yt, audio_hq, title):
		path = self.desktop_path
		itag_a = audio_hq['itag']

		if not os.path.exists(path + '/audio/webm'):
			os.makedirs(path + '/audio/webm')
		# ここで音声をダウンロード
		yt.streams.get_by_itag(itag_a).download(path + '/audio/webm', filename=title)

	def download_video(self, yt, video_hq, title):
		path = self.desktop_path
		itag_v = video_hq['itag']
		
		if not os.path.exists(path + '/video/original'):
			os.makedirs(path + '/video/original')
		# ここで動画をダウンロード
		yt.streams.get_by_itag(itag_v).download(path + '/video/original', filename=title)

	def opus_to_aac(self, path, title, audiopath):
		# opus to aac
		if not os.path.exists(path + '/audio/aac'):
			os.mkdir(path + '/audio/aac')

		title_aac = path + '/audio/aac/' + title + '.' + 'm4a'
		instream_a = ffmpeg.input(audiopath)
		stream = ffmpeg.output(instream_a, title_aac, audio_bitrate=160000, acodec="aac")
		ffmpeg.run(stream, overwrite_output=True)

		return title_aac


	def join_audio_video(self, video_hq, path, title, videopath, audiopath):		
		# titleの最後が.の場合は.を付けない。もし最後がなら...の可能性もあるから正規表現で取り出した方がいいよ。
		
		

		# join h264 and aac
		if video_hq['acodec'] is None: #これのおかげで音付きの動画の場合はエンコードかからない。
			if not os.path.exists(path + '/video/joined'):
				os.mkdir(path + '/video/joined')

			title_join = path + '/video/joined/' + title + '.' + 'mp4'
			instream_v = ffmpeg.input(videopath)
			instream_a = ffmpeg.input(audiopath)
			stream = ffmpeg.output(instream_v, instream_a, title_join, vcodec='copy', acodec='copy') #vcodec='h264'にすればエンコードしてくれる。
			ffmpeg.run(stream, overwrite_output=True)
	


	def download(self, url):
		path = self.desktop_path
		qs = urllib.parse.urlparse(url).query
		videoID = urllib.parse.parse_qs(qs)['v'][0]
		url = f'https://www.youtube.com/watch?v={videoID}'
		for i in range(10):
			try:
				yt = YouTube(url)
			except RegexMatchError as e:
				print('動画情報を取得できなかった。')
			else:
				print('上手く行きました。')
				break

		yt.register_on_progress_callback(self.show_progress_bar)
		alltag = yt.streams
		title = yt.title
		print(title)
		try:	
			artist = yt.metadata[0]['Artist']
			song = yt.metadata[0]['Song']
			with self.lock:
				self.songDatas[threading.currentThread().getName()] = meta.addMusicData(song, artist)

			# デフォルトは英語情報を表示したいのでの文字列を渡す。
			self.songDatas[threading.currentThread().getName()].send_songData('USA')
		except KeyError:
			print('取得出来なかった。')

		title = self.remove_symbol(title)
		
		audios, videos = self.makelist(alltag)
		
		audio_hq = self.select_hq_a(audios)
		ta = threading.Thread(target=self.download_audio, args=[yt, audio_hq, title,])
		ta.start()
		
		if self.mode == '2':
			video_hq = self.select_mobile_v(videos)
			print(f'ここあるよね：{video_hq}')
			tv = threading.Thread(target=self.download_video, args=[yt, video_hq, title,])

			tv.start()
			tv.join()

		if self.mode == '3':
			video_hq = self.select_hq_v(videos)
			tv = threading.Thread(target=self.download_video, args=[yt, video_hq, title,])

			tv.start()
			tv.join()

		ta.join()

		audiopath = path + '/audio/webm/' + title + '.' + audio_hq['mime_type'].split('/')[1]
		# aacの音声ファイルのパスをもらう。
		audiopath = self.opus_to_aac(path, title, audiopath)
		if not self.mode == '1':
			videopath = path + '/video/original/' + title + '.' + video_hq['mime_type'].split('/')[1]
			self.join_audio_video(video_hq, path, title, videopath, audiopath)

	def get_progress(self, threads):
		while any(t.is_alive() for t in threads):
			with self.lock:
				percent = round(sum(self.percent.values()) / (self.count * self.number))
				# sys.stdout.write('  {percent}%\r'.format(percent=percent))
				eel.putProgress(percent)
			time.sleep(1.0)
		# print(f'  {percent}%', flush=True)
		eel.putProgress(100)


	def multi_download(self):
		global start
		start = time.time()
		downloads = []
		join_audio_videos = []

		for url in self.urls:
			t = threading.Thread(target=self.download, args=[url,])
			t.start()
			downloads.append(t)
		
		monitor_progress = threading.Thread(target=self.get_progress, args=(downloads,))
		monitor_progress.start()
		
		for t in downloads:
			t.join()
		
		monitor_progress.join()
		# print(self.titles)
		# # ここに結合の処理を追加する。
		# for title in self.titles:
		# 	join_audio_video = threading.Thread(target=self.join_audio_video, args=(title,))
		# 	join_audio_video.start()
		# 	join_audio_videos.append(join_audio_video)
		
		# for join_audio_video in join_audio_videos:
		# 	join_audio_video.join()

		print('done')
		eel.doneProgress()

		time_of_script = time.time() - start
		print('実行時間：{}'.format(time_of_script))



			
# Downloader = Downloader(['https://www.youtube.com/watch?v=cw4-bqSpVdo','https://www.youtube.com/watch?v=CGXhyRiXR2M'])
# Downloader.multi_download()

# Downloader.async_dl(['https://www.youtube.com/watch?v=cw4-bqSpVdo','https://www.youtube.com/watch?v=CGXhyRiXR2M'])

# eel.start('index.html', close_callback=print(Downloader.title))



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