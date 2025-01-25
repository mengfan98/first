from colorama import Fore, init
import pandas as pd
import os

# 初始化 colorama
init(autoreset=True)

def print_R(str):
    print(Fore.RED + str)

def print_G(str):
    print(Fore.GREEN + str)


def compare_excel_files(old_file_path, new_file_path):
    try:
        # 读取两个版本的Excel文件
        old_xls = pd.ExcelFile(old_file_path)
        new_xls = pd.ExcelFile(new_file_path)

        # 获取所有sheet名
        old_sheet_names = old_xls.sheet_names
        new_sheet_names = new_xls.sheet_names

        # 检查两个文件的sheet名是否相同
        if set(old_sheet_names) != set(new_sheet_names):
            print_R(f"Sheet names differ between {old_file_path} and {new_file_path}")
            return

        # 遍历每个sheet进行比较
        for sheet_name in old_sheet_names:
            old_df = old_xls.parse(sheet_name)
            new_df = new_xls.parse(sheet_name)

         # 对齐DataFrame的索引和列
            old_df, new_df = old_df.align(new_df, axis=None)
            # 检查两个DataFrame的形状是否相同
            if old_df.shape != new_df.shape:
                # print_R(f"Sheet '{sheet_name}' has different shape in {old_file_path} and {new_file_path}")
                continue

            # 找出发生变化的单元格
            diff = old_df != new_df
            if diff.any().any():
                changed_rows = diff.any(axis=1)
                changed_indices = diff.index[changed_rows].tolist()
                for index in changed_indices:
                    old_row = old_df.loc[index]
                    new_row = new_df.loc[index]
                    # print_R(f"Row {index}:")
                    for col in old_df.columns:
                        if old_row[col] != new_row[col] and not (pd.isnull(old_row[col]) and pd.isnull(new_row[col])):
                            # print_R(f"Sheet '{sheet_name}' has changes in rows: {changed_indices}")
                            print_R(f"Sheet '{sheet_name} :Row {index}--Column'{col}': {old_row[col]} -> {new_row[col]}")
            else:
                print_G(f"Sheet '{sheet_name}' has no changes")

    except pd.errors.ParserError as e:
        print_R(f"Error parsing Excel file: {e}")
    except IOError as e:
        print_R(f"Error reading Excel file: {e}")
    except Exception as e:
        print_R(f"An unexpected error occurred: {e}")

def main():
    # 获取用户输入的两个Excel文件路径
    old_file_path = input("请输入旧版本的Excel文件路径: ").strip()
    new_file_path = input("请输入新版本的Excel文件路径: ").strip()

    # 检查文件是否存在
    if not os.path.exists(old_file_path):
        print_R(f"文件 {old_file_path} 不存在")
        return
    if not os.path.exists(new_file_path):
        print_R(f"文件 {new_file_path} 不存在")
        return

    # 比较Excel文件中的数据
    compare_excel_files(old_file_path, new_file_path)

# 主程序入口
if __name__ == "__main__":
    main()
