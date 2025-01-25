
from colorama import Fore, Back, Style, init

# 初始化 colorama
init(autoreset=True)

# print(Fore.RED + '这是红色文本')
# print(Back.GREEN + '这是绿色背景的文本')
# print(Style.BRIGHT + '这是亮色文本')
# print(Fore.BLUE + Back.YELLOW + '这是蓝色文本和黄色背景')
def print_R(str):
    print(Fore.RED + str)

def print_G(str):
    print(Fore.GREEN + str)

# 读取某行某列数据，写入数据 保存excel文件
import pandas as pd

# 读取Excel文件
file_path = 'stone.xlsx'  # 替换为你的Excel文件路径
xls = pd.ExcelFile(file_path)

# 获取所有sheet名
sheet_names = xls.sheet_names
print(sheet_names)
# print(xls.parse(sheet_names[0]))
for sheet_name in sheet_names:
    print("---------" + sheet_name + "---------")
    df = xls.parse(sheet_name)
    print(df)

import os
import hashlib
import json

def calculate_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def get_files_in_directory(directory):
     # 获取目录中的所有文件，并排除当前文件
    current_file = os.path.basename(__file__)
    files = []
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if filename != current_file:
                files.append(os.path.join(root, filename))
    return files

def create_hash_json(directory):
    file_hashes = {}
    files = get_files_in_directory(directory)
    
    if os.path.exists('file_hashes.json'):
        with open('file_hashes.json', 'r') as json_file:
            file_hashes = json.load(json_file)
    else:
        file_hashes = {}

    need_to_update_json = 0
    
    for file_name in files:
        if file_name.find('.xlsx') == -1:
            continue
        file_path = os.path.join(directory, file_name)
        md5Data =  calculate_md5(file_path)
        if len(file_hashes) == 0 or (file_name in file_hashes and file_hashes[file_name] != md5Data) or (file_name not in file_hashes):
            print_R(f"{file_name}------changed")
            need_to_update_json += 1
        # else :
            # print_G(f"{file_name}-------no changed")
        file_hashes[file_name] = md5Data

    if need_to_update_json:
        with open('file_hashes.json', 'w') as json_file:
            json.dump(file_hashes, json_file, indent=4)
    print_R(f"{need_to_update_json} file changed")

# 获取当前目录
current_directory = os.getcwd()

# 创建并写入JSON文件
create_hash_json(current_directory)





