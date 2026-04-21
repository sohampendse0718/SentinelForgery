import fs from 'fs';
import path from 'path';

async function download() {
  try {
    const url = "https://lh3.googleusercontent.com/aida-public/AB6AXuDutVpLyulyXH0iayyo_KwbEWypzCW9sz7s_94_IF739DTOeILZDYczr8ngLel5vhGTuYQ7RmKAKk1JyxRVp4V2yeY8zPZU8pLIruhr8-STo9JlHwTrdUJ7Z3aqOCDgpYvZT5nj-xb8T6nNKKlao4DkDn6JcIq98PjBI5LLlmGRj664Yiiqq2daUPkgUFRW3YXU-qBgBw79BSJqxG5dOz7cFZGiP4fPLDGwJ3-kjgfSAca7g73Py-4CQXg3xli8qRNta3mFNXyM0gyr";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    
    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    fs.writeFileSync(path.join(publicDir, 'fingerprint.jpg'), buffer);
    console.log("Downloaded successfully to public/fingerprint.jpg, size:", buffer.length);
  } catch (err) {
    console.error("Failed to download:", err);
  }
}

download();
