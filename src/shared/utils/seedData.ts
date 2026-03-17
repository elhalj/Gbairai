import { mockPosts } from '../data/mockData';
import { api } from '../services/api/postServices';

export async function seedDatabase() {
  console.log('Seeding database with initial posts...');
  
  try {
    for (const post of mockPosts) {
      await api.createPost({
        title: post.title,
        content: post.content,
        category: post.category,
        authorName: post.author.name,
        image: post.image,
      });
    }
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}
