const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SOURCE_DIR = 'src';
const EXCLUDE_PATTERNS = ['src/.vuepress/', 'src/README.md'];  // 相对于仓库根目录
const WINDOW_MINUTES = 3;

// 解析 "YYYY-MM-DD HH:mm" 格式的北京时间字符串，返回对应的 UTC Date 对象
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
  // 返回 UTC 时间（北京时间 = UTC+8 → 构造 UTC 时间时小时减8）
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
}

// 递归查找所有 .md 文件
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

// 检查是否应排除（相对于仓库根目录）
function isExcluded(filePath) {
  const repoRoot = process.cwd();
  const relative = path.relative(repoRoot, filePath).replace(/\\/g, '/');
  return EXCLUDE_PATTERNS.some(pattern => 
    relative.startsWith(pattern) || relative === pattern
  );
}

function main() {
  const nowUTC = new Date();  // 当前 UTC 时间
  // 显示北京时间（仅用于日志，不参与计算）
  const beijingNowStr = nowUTC.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
  console.log(`当前北京时间: ${beijingNowStr}`);

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

    // 必须有 publishDate 且当前为草稿才处理
    if (!parsed.data.publishDate || parsed.data.draft !== true) return;

    const publishDateStr = parsed.data.publishDate.trim();
    if (!publishDateStr) {
      console.log(`⚠️ 文件 ${file} 的 publishDate 为空，跳过`);
      return;
    }

    const publishUTC = parseBeijingDate(publishDateStr);
    if (isNaN(publishUTC.getTime())) {
      console.log(`⚠️ 文件 ${file} 的 publishDate 格式无效: "${publishDateStr}"，跳过`);
      return;
    }

    // 计算时间差（分钟），负值表示未来
    const diffMs = nowUTC - publishUTC;
    const diffMinutes = diffMs / (1000 * 60);

    console.log(`检查: ${file} -> 发布时间: ${publishDateStr}, 相差 ${diffMinutes.toFixed(2)} 分钟`);

    // 仅在发布时间 ≤ 当前时间，且差值在窗口内时发布
    if (diffMinutes >= 0 && diffMinutes <= WINDOW_MINUTES) {
      console.log(`   ✅ 在窗口内，移除 draft 和 index 标记`);

      // 方式1：正则替换（简单，但需注意正文误伤）
      // let newContent = content.replace(/^draft:\s*true\s*\n?/gm, '');
      // newContent = newContent.replace(/^index:\s*false\s*\n?/gm, '');
      // fs.writeFileSync(file, newContent, 'utf8');

      // 方式2：使用 gray-matter 修改（更安全）
      const { data, content: body } = parsed;
      delete data.draft;
      delete data.index;
      const updated = matter.stringify(body, data);
      fs.writeFileSync(file, updated, 'utf8');

      changed = true;
    } else if (diffMinutes < 0) {
      console.log(`   ⏳ 发布时间在未来，跳过`);
    } else {
      console.log(`   ⏳ 超出窗口 (${diffMinutes.toFixed(2)} > ${WINDOW_MINUTES})，跳过`);
    }
  });

  if (!changed) {
    console.log('没有文章需要发布');
  }
}

main();