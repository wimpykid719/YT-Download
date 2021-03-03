import logging

def get_logger(logger_name, log_file, f_fmt='%(message)s'):

	"""ロガーを取得"""
	# ロガー作成
	logger = logging.getLogger(logger_name)
	logger.setLevel(logging.DEBUG)

	# ファイルハンドラ作成
	file_handler = logging.FileHandler(log_file, mode='a', encoding='utf-8')
	file_handler.setLevel(logging.DEBUG)
	file_handler.setFormatter(logging.Formatter(f_fmt))

	# ロガーに追加
	logger.addHandler(file_handler)

	return logger
