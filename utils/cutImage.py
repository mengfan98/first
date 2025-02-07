from PIL import Image
import os

def cut_image(image_path, output_folder, output_size, rows, cols, output_format):
    # 打开图片
    img = Image.open(image_path)
    width, height = img.size

    # 确保输出文件夹存在
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 计算每个小图片的宽度和高度
    piece_width = width // cols
    piece_height = height // rows

    # 开始切割图片
    for i in range(rows):
        for j in range(cols):
            box = (j * piece_width, i * piece_height, (j + 1) * piece_width, (i + 1) * piece_height)
            piece = img.crop(box)
            
            # 调整大小
            piece = piece.resize(output_size)
            
            # 保存图片
            output_path = os.path.join(output_folder, f'piece_{i+1}_{j+1}.{output_format.lower()}')
            piece.save(output_path)
    
    print(f"图片已成功切割并保存到 {output_folder} 文件夹中。")

def main():
    # 获取用户输入
    image_path = input("请输入图片路径: ")
    output_folder = 'output_' + os.path.basename(image_path)

    output_size_width = int(input("请输入每个切割块的输出宽度: "))
    output_size_height = int(input("请输入每个切割块的输出高度: "))
    rows = int(input("请输入切割的行数: "))
    cols = int(input("请输入切割的列数: "))
    output_format = input("请输入输出图片格式 (默认 PNG): ")

    # 设置默认输出格式
    if not output_format:
        output_format = 'PNG'

    output_size = (output_size_width, output_size_height)

    # 调用切割图片函数
    cut_image(image_path, output_folder, output_size, rows, cols, output_format)

if __name__ == "__main__":
    main()
