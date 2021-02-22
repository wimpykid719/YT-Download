import sys
from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need fine tuning.

includes = []


build_exe_options = {"packages": [], "excludes": [], "includes": includes, "include_files":"web"}

# GUI applications require a different base on Windows (the default is for
# a console application).
base = None
if sys.platform == "win32":
	base = "Win32GUI"

setup(  name = "YT_Download",
		version = "0.1",
		description = "YoutubeDownloader",
		options = {"build_exe": build_exe_options},
		executables = [Executable("app.py", base=base)])