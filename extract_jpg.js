import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// 获取当前路径
const currentDir = process.cwd();
const inputVideo = path.join(currentDir, 'CatText.mp4');
const outputDir = path.join(currentDir, 'public', 'myspace_frames');

// 创建存放图片的文件夹
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('开始抽帧 (极高画质 JPG 模式)，正在处理中，请稍候...');

// 🌟 核心变化：这里输出的是 .jpg，彻底绕开之前的 libwebp 报错！
const cmd = `ffmpeg -i "${inputVideo}" -vf fps=30 -q:v 5 "${outputDir}/frame_%04d.jpg"`;

try {
  // 执行命令
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ 完美！抽帧成功！图片已存入 public/myspace_frames 文件夹。');
} catch (error) {
  console.error('❌ 抽帧还是失败了，原因：', error.message);
}