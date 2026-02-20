const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ---------- 配置 ----------
const SOURCE_DIR = 'src';                 // 你的文档根目录
const EXCLUDE_PATTERNS = [
  '/src/.vuepress/',                       // 排除 .vuepress 目录下所有文件
  '/src/README.md'                          // 排除根 README.md
];
// 注意：路径匹配时使用相对于仓库根目录的完整路径，如 'src/.vuepress/config.js'

// ---------- 工具函数 ----------

// 获取北京时间当前时间字符串 (YYYY-MM-DD HH:mm)
function getBeijingNow() {
  const now = new Date();
  // 转换为北京时间（UTC+8）
  const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  return beijingTime.toISOString().slice(0, 10) + ' ' +
         beijingTime.toTimeString().slice(0, 5);
}

// 递归查找所有 .md 文件（排除 node_modules 等）
function findMdFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // 跳过 node_modules 和 .git 等
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.github') continue;
    if (entry.isDirectory()) {
      findMdFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.md')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 检查文件是否应被排除
function isExcluded(filePath) {
  // 转换为相对于仓库根目录的路径（使用正斜杠）
  const relative = filePath.replace(/\\/g, '/');
  for (const pattern of EXCLUDE_PATTERNS) {
    if (relative.startsWith(pattern) || relative === pattern.slice(1)) { // 处理 /src/README.md 与 src/README.md 的匹配
      return true;
    }
  }
  return false;
}

// ---------- 主逻辑 ----------
function main() {
  const nowStr = getBeijingNow();
  console.log(`当前北京时间: ${nowStr}`);

  // 确定要扫描的绝对路径
  const rootDir = path.join(process.cwd(), SOURCE_DIR);
  if (!fs.existsSync(rootDir)) {
    console.error(`错误: 源目录 ${SOURCE_DIR} 不存在`);
    process.exit(1);
  }

  const mdFiles = findMdFiles(rootDir);
  console.log(`找到 ${mdFiles.length} 个 .md 文件`);

  let changed = false;

  mdFiles.forEach(file => {
    // 跳过被排除的文件
    if (isExcluded(file)) {
      console.log(`⏭️ 跳过排除文件: ${file}`);
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const parsed = matter(content);

    // 必须同时存在 publishDate 和 draft: true 才处理
    if (!parsed.data.publishDate || parsed.data.draft !== true) return;

    const publishDateStr = parsed.data.publishDate.trim();
    console.log(`检查: ${file} -> 发布时间: ${publishDateStr}`);

    // 字符串比较要求格式严格为 "YYYY-MM-DD HH:mm"
    if (nowStr >= publishDateStr) {
      console.log(`   ✅ 达到发布时间，移除 draft 标记`);

      // 移除 "draft: true" 行（支持多种空格变体）
      const newContent = content.replace(/^draft:\s*true\s*\n?/gm, '');
      fs.writeFileSync(file, newContent, 'utf8');
      changed = true;
    } else {
      console.log(`   ⏳ 尚未到达发布时间`);
    }
  });

  if (!changed) {
    console.log('没有文章需要发布');
  }
}

main();