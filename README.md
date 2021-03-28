# Document

## YT-Download

Youtube download desktop app made with Python.

## Demo


<img src="https://user-images.githubusercontent.com/23703281/112720791-ef948180-8f43-11eb-9f64-0ca4ec8c7d13.gif" width="1280">


## Features

- Download youtube from URL
- Convert opus to aac
- High quality 1080p ~ over2160p movie + 160kbps audio
- High speed for the asynchronous processing
- Add infomation about audio Name, Artist, Album, Genre, Year, CoverArt, Lyrics （iTunes support）



## Requirement

- requests
- BeautifulSoup
- Eel
- ffmpeg-python
- mutagen
- pytube

## Installation

This system needs ffmpeg and google chrome so Install them first.

```bash
git clone https://github.com/wimpykid719/YT-Download.git
pip install -r requirements.txt
```

## Usage

```bash
python app.py
```
YT_Download starts with chrome app mode.


## Note

I didn't limit number of download at same time. So, It's dangerous for the few resources computer. I recommend to limit download 5 URL at same time. 


## ToDo
🔨　Build to exe, app file and easy install for Every one. I used [cx_freeze](https://github.com/marcelotduarte/cx_Freeze) I could build app file starts YT_download without Python install the system. But YT_download try to make new file then error occurs. I opend issue [#952](https://github.com/marcelotduarte/cx_Freeze/issues/952) still no reply. I think I should use electron.

🔨　It has many bugs still. Needs Refactoring.

🔨　Using React at frontend.

🔨　Add Animation of push the save button.


## License

YT_download is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

Mit License

Please teach me the review of this app.

# ポートフォリオとして

![Frontend](https://user-images.githubusercontent.com/23703281/112721198-fc19d980-8f45-11eb-8381-99e0b36c950c.png)

## アプリの概要

Youtubeをダウンロードして、音声の情報（曲名、アーティスト名、ジャンル、年代、アートワーク、歌詞）を自動で取得する。AACファイルにiTunesに対応した形式で書き込む。

### どんな意図で作ったのか

昔Apple MusicやSpotifyの音楽ストリーミングサービスが出る前に、友人がYoutubeから音楽をipodに入れるのに[Area 61 ダウンローダー](http://www.area61.com/downloader/downloader-manual.htm)というアプリを使用していました。

**作業内容**

- アプリを使って動画をダウンロード
- 別のアプリで動画から音声をAAC形式で抽出
- iTunesに登録後に曲情報をgoogleで検索して貼り付ける

動画をダウンロードして、音声を抽出して曲情報をgoogleで検索して、アートワークの画像を貼り付けてと一曲ずつ丁寧にiTunes上で作業を行なっていました。3曲追加するだけでも15分ほど掛かっていました。

当時はプログラミングのアプリを作るのは夢のまた夢みたいな感覚で友人は大変な作業を通して音楽を聞いていました。現在はプログラミングに関する情報も整備されて独学でも学びやすい環境になり、その事を思い出してポートフォリオも兼ねて作成しました。

このアプリを使えば友人が15分かけていた作業を20秒ほどで終わらせる事が出来ます。

### こだわった箇所

#### フロントエンド


![radioButton](https://user-images.githubusercontent.com/23703281/112608493-ba156880-8e5d-11eb-9402-ce723d9fe0a5.png)

- シンプルなUIでユーザの選択肢を減らした。

「ヒックの法則」では選択肢が多過ぎるとユーザーは迷ってしまい、こちらが望む行動を起こさないと言われています。
ユーザが選択するのはダウンロード時に音声のみか、モバイル向けの画質で一番画質が良いもの、一番画質が良いものの3つのみに絞る事ユーザが判断する時間を減らしユーザにプレッシャーを与えないようにしました。そうする事でユーザがスムーズにアプリを使用出来るよう作成しました。


![progress](https://user-images.githubusercontent.com/23703281/112608451-ad911000-8e5d-11eb-84aa-c794e4ca1d6f.png)


- 待機処理が入る際はどれくらいで終わるか表示する。

ローディングのアニメーションを挟む事でユーザへのストレスを軽減しました。
また重い処理が入る際はプログレスバーを表示してどれくらいの目安で処理が終わるのかを表示しています。

**苦労した箇所**

サーバから応答があるまでローディングアニメーションを表示させる事については記事が多くあったのですが、正確な進捗状況をサーバから受け取りそれを表示するという事について書かれた記事はなかったので実装する上で少し苦労しました。Eelではサーバ側からフロントのJavaScript関数を実行出来るため、「Python側の変数（進捗状態）JavaScriptの関数に引数として渡してDOM内容を書き換える作業」を1秒毎に行わせてプログレスバーを実装しました。


![Thumbnail](https://user-images.githubusercontent.com/23703281/112608773-111b3d80-8e5e-11eb-9853-f6f682a8a98a.png)

- 意図しない動画のダウンロード防止する。

URLを入力した時点で動画のタイトル・サムネイルを取得して表示させています。ユーザがこれからダウンロードする動画が合っているか相互確認するために実装しました。

**苦労した箇所**

細かいデザインで機能としては関係ないのですが、サムネイル下半分にグラデーションが掛かっています。それは背景のサムネイルの色に合わせて変更するようになっていて、[color-thief](https://github.com/lokesh/color-thief)というライブラリで画像にある特徴的な色を抽出してそれをグラデーションに適用しています。サムネイルのDOMは最初2つとも同じだったので片方の色が変わったらもう片方も変更されてしまう状態になっていました。個別にclass名を追加して変更されるようにしました。中々、思うようにいかないと痛感しました。

<img src="https://user-images.githubusercontent.com/23703281/112721100-7007b200-8f45-11eb-99f0-88ed721067a9.gif" width="1280">

- レスポンシブ対応・ハンバーガーメニュー

最近では当たり前だけど、しっかり作りきった事がなかったので今回作成する事が出来てよかった。


#### バックエンド

- 待機処理を並列・非同期処理にする事で動作速度向上

待機処理を行う動作は主に2種類あります。

1. 動画・音声のダウンロード時
2. サムネイル・タイトルのダウンロード・音声情報を取得するために歌詞サイト・iTunesAPIへのアクセス時

前者はThreadを用いてマルチスレッドで並列に処理を行うようにしました。
理由は動画・音声のダウンロードはプログレッシブ形式（データを保存しながら再生可能）なので保存とダウンロードが交互に行われ、全く処理が行われない状況は少ないと思いました。並列処理を行わせ速度改善を図りました。マルチスレッドなのでこちらの方が多くリソースを消費すると予想されます。

後者はasyncioを用いて非同期処理で待機する時間がある際に途中で処理を切り替えて行うようにしました。
理由は `requests.get()` でリクエストを投げて返ってくるまでの間はそこで全く処理が行われない状況が発生して、その間に別のリクエストを投げるなどしてできる限り待機する処理を短くしました。
こうする事で2つリクエストを投げる処理がある際に1つの処理でレスポンスに1秒かかるとする。2つだと全体で2秒の待機処理が入る。これをノンブロッキングに変えリクエストを投げた直後に待機処理に入らず、直ぐに別のリクエストを投げる。するとほとんど同時にレスポンスが返ってくるので待機時間は1秒になる。これが8つなどのリクエストになってもだいたい1秒近くで返ってくるので、リクエストの数が増えるほど効果がある。そしてスレッドは一つしか使用していないのでマルチスレッドよりもリソースの消費が少ないと思われる。

※ただ今回のプログラムでは `requests` を用いておりライブラリ自体非同期に対応していないため構文上は非同期処理ですが、内部では並列処理が行われています。

**苦労した箇所**

asyncioの構文が難しくてどのような仕組みで動作しているの分からなかったので、asyncioがPythonのどんな機能から出来ているのか調べる所から入りました。調べた内容は下記の記事にまとめてあります。
[Pythonのrequestsを非同期にしてiTunes APIに高速にリクエストを投げるには](https://zenn.dev/unemployed/articles/96ef729c7a091d)




![progressNumber](https://user-images.githubusercontent.com/23703281/112609997-8f2c1400-8e5f-11eb-8051-4eb67a2eb4fa.png)


- 並列で行われている処理の進捗を計算する。

```Python
def show_progress_bar(self, stream, chunk, bytes_remaining):
    current = ((stream.filesize - bytes_remaining)/stream.filesize)
    with self.lock:
        self.percent[threading.currentThread().getName()] = current*100
```
`stream.filesize`にはURL一つ当たりでダウンロードされる予定のファイルサイズの値が入る。
`bytes_remaining`にはまだダウンロードされていないファイルサイズが入る。
`(全体のファイルサイズ - 残りのファイルサイズ)/全体のファイルサイズ` でどれくらいの割合のデータがダウンロードされたか計算している。その値を`self.percent` に各々のスレッド進捗として格納する。

```Python
def get_progress(self, threads):
    while any(t.is_alive() for t in threads):
        with self.lock:
            percent = round(sum(self.percent.values()) / (self.count * self.number))
            eel.putProgress(percent)
        time.sleep(1.0)
    eel.putProgress(100)
```
最後に`self.percent`の値を全て足して、現在立ち上がっているスレッドの数で割って全体の進捗状況の値を`eel.putProgress(percent)`でフロントに渡している。

![songInfo](https://user-images.githubusercontent.com/23703281/112707310-b9c4ae00-8eed-11eb-9395-c9658a144023.png)

- 音声情報の取得

最初はShazamのように音声ファイルを解析して情報を取得出来るかと考えていましたが、そのようなAPIも技術もなかったので、無理かと考えていました。そこでYoutubeの動画についての説明欄に、動画内で使用されている音声情報を付与している事に気付きました。そこから音声情報を取得してiTunesAPIに投げる事でより詳細は情報（ジャンル、年代、アートワーク）を取得出来るようになりました。

担当者はポートフォリオを隅々とはみないので紹介したい機能は自分から名乗りましょう。出来ればその際に苦労した躓いた箇所も説明出来るといいかもしれません。

**苦労した箇所**

Pytubeに動画の詳細情報をリスト形式で取得出来るとドキュメントに書かれていたが、リスト形式で取得出来なかったのでissueを作成して直してもらった。自分でプルリクエスト出してマージして貰えれば良いのだが、難しいと考え助けを求めた。


### 使用技術・選定理由

バックエンドは一番慣れているPythonを使用して作成しました。Eelというライブラリを使用してフロントエンドはHTML・CSS（SCSS）・JavaScriptを用い作成しました。PythonでGUIアプリを作成する場合、tkinter, kivy, PyQt, wxPython等が挙げられるのですが、GUIを作成するのに独自の記法を学ぶ必要があり、それらは汎用性が低く今後Web開発もやってみたいと考えていたので、HTML・CSS・JavaScriptでGUIが作成出来る。Eelを選択しました。
作成後にexe, app形式にしてインストールを簡単に出来るようにcx_Freeze使用を試みました。その他にもpy2exe, py2app, PyInstallerがありましたが、2つは開発が終了しており、PyInstallerはexe化したファイルの起動が遅いと書かれた記事を見たのでcx_Freezeを選択しました。

#### 上手くいかなかった事

結果的にbuildしてapp形式に出来ました。しかし新しくファイルを作成する `open()` 処理が走るとエラーが起こり上手く動作しませんでした。app形式にした場合、consoleが立ち上がらないのでエラーが起きても分かりません。そこでファイルにlogを残すコードを追記したのですが、logファイルを生成する過程でエラーが出るのでlogファイル自体を生成することが出来ませんでした。
別のパソコンでも簡単に動作する形にまで持っていきたかったのですが、上手くいきませんでした。実行環境を意識させずに実行ファイルとして作成する場合、Pythonでは難易度が高かったです。

#### 考えられる対策
コンパイラ言語で書いていたらこの辺りの問題は解決出来ていたかと思います。もしくはElectronを使用してバックエンドをnodeJsで書く方法もあったと思います。それらを使って今回のアプリを作成する技術力が必要だと感じました。Pyinstallerの方が記事が豊富なので、起動時間は多少遅くてもbuildするのが良いかも知れないです。


### 出来ない事・出来る事

#### 出来ない事

今回データベース等は使用しなかったので、SQL操作を行う練習が必要になると思います。少しづつではありますが勉強しています。
AWS、GCP（一度だけスクリプトをデプロイしました。）等にデプロイする事をしなかったので、その辺りのネットワーク・Linux等の知識がWeb開発をする場合、必要だと考えています。
Webサービス等を開発する際、先にGithub等でオープンソースの人気プロジェクトを参考に設計を進めると綺麗な設計手法を学びながら作成出来るという事を知りませんでした。思うままに設計してしまい読みやすく綺麗なコードと言い難い状態になっています。今後アプリを作成する際は似たようなプロジェクトを参考に開発をしたいと考えています。

#### 出来る事

上記のポートフォリオから、Pythonを使用した簡単なAPIを使用したスクリプト、処理速度を配慮したスクリプトの作成、HTML・CSS（SCSS）・JavaScriptを使用したWeb制作は出来ます。JavaScriptのモダンなライブラリ等を使用してアプリを作成出来るほどではないですが、Reactのチュートリアルで[五目並べ](https://github.com/wimpykid719/react-get-start)を作成しました。

