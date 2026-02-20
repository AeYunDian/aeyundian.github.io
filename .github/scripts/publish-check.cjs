const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SOURCE_DIR = 'src';
const EXCLUDE_PATTERNS = ['src/.vuepress/', 'src/README.md'];
const WINDOW_MINUTES = 5;

function getBeijingNow() {
  const now = new Date();
  return new Date(now.getTime() + 8 * 60 * 60 * 1000);
}

function parseBeijingDate(dateStr) {
  if (typeof dateStr !== 'string') return new Date(NaN);
  const parts = dateStr.split(' ');
  if (parts.length !== 2) return new Date(NaN);
  const [datePart, timePart] = parts;
  const dateParts = datePart.split('-');
  const timeParts = timePart.split(':');
  if (dateParts.length !== 3 || timeParts.length !== 2) return new Date(NaN);
  const [year, month, day] = dateParts.map(Number);
  const [hour, minute] = timeParts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) return new Date(NaN);
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
}

function findMdFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.github') continue;
    if (entry.isDirectory()) {
      findMdFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.md')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function isExcluded(filePath) {
  const relative = filePath.replace(/\\/g, '/');
  for (const pattern of EXCLUDE_PATTERNS) {
    if (relative.startsWith(pattern) || relative === pattern.slice(1)) {
      return true;
    }
  }
  return false;
}

function main() {
  const nowBeijing = getBeijingNow();
  console.log(`当前北京时间: ${nowBeijing.toLocaleString('zh-CN', { hour12: false })}`);

  const rootDir = path.join(process.cwd(), SOURCE_DIR);
  const mdFiles = findMdFiles(rootDir);
  let changed = false;

  mdFiles.forEach(file => {
    if (isExcluded(file)) {
      console.log(`⏭️ 跳过排除文件: ${file}`);
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const parsed = matter(content);

    // 必须同时有 publishDate 和 draft: true
    if (!parsed.data.publishDate || parsed.data.draft !== true) return;

    // 检查 publishDate 是否为字符串
    if (typeof parsed.data.publishDate !== 'string') {
      console.log(`⚠️ 文件 ${file} 的 publishDate 不是字符串 (${typeof parsed.data.publishDate})，跳过`);
      return;
    }

    const publishDateStr = parsed.data.publishDate.trim();
    if (!publishDateStr) {
      console.log(`⚠️ 文件 ${file} 的 publishDate 为空字符串，跳过`);
      return;
    }

    // 尝试解析日期
    const publishBeijing = parseBeijingDate(publishDateStr);
    if (isNaN(publishBeijing.getTime())) {
      console.log(`⚠️ 文件 ${file} 的 publishDate 格式无效: "${publishDateStr}"，跳过`);
      return;
    }

    const diffMs = Math.abs(nowBeijing - publishBeijing);
    const diffMinutes = diffMs / (1000 * 60);

    console.log(`检查: ${file} -> 发布时间: ${publishDateStr}, 相差 ${diffMinutes.toFixed(2)} 分钟`);

    if (diffMinutes <= WINDOW_MINUTES) {
      console.log(`   ✅ 在窗口内，移除 draft 标记`);

      const newContent = content.replace(/^draft:\s*true\s*\n?/gm, '');
      fs.writeFileSync(file, newContent, 'utf8');
      changed = true;
    } else {
      console.log(`   ⏳ 不在窗口内，跳过`);
    }
  });

  if (!changed) {
    console.log('没有文章需要发布');
  }
}

main();