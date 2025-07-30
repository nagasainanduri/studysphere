import { studysphere_backend } from '../../declarations/studysphere_backend/index.js';

async function test() {
  try {
    const user = await studysphere_backend.getUser();
    console.log('User:', user);
    const groups = await studysphere_backend.getGroups();
    console.log('Groups:', groups);
    const tokens = await studysphere_backend.getTokens();
    console.log('Tokens:', tokens);
  } catch (error) {
    console.error('Backend error:', error);
  }
}

test();