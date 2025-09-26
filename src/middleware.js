// src/middleware.js
import { createClient } from '@vercel/edge-config';

// 初始化 Edge Config 客户端
const config = createClient({
  id: 'ecfg_lu8ilfipzk5yqzqvinfsmty75wkv', // 替换为你的实际 Edge Config ID
  token: process.env.VERCEL_EDGE_CONFIG_TOKEN, // 从环境变量读取
});

// 边缘函数入口
export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/config') {
    try {
      const data = await config.get('web1'); // 读取 key 为 'web1' 的数据
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error reading Edge Config:', error);
      return new Response(JSON.stringify({ error: 'Failed to read config' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Not found', { status: 404 });
}