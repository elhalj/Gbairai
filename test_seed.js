const mockPosts = [
  {
    id: '1',
    title: 'Victoire éclatante de l\'équipe nationale de football',
    content: 'L\'équipe nationale a remporté une victoire historique hier soir contre son rival régional avec un score de 3-1. Les supporters ont envahi les rues pour célébrer cette performance exceptionnelle qui propulse l\'équipe en finale du championnat.',
    category: 'sports',
    author: {
      name: 'Mamadou Diallo'
    },
    image: 'https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBtYXRjaCUyMHN0YWRpdW18ZW58MXx8fHwxNzcxNzQ2NDIwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    title: 'Nouvelle initiative communautaire pour l\'eau potable',
    content: 'Les habitants du quartier de Madina se mobilisent pour installer un nouveau système d\'approvisionnement en eau potable. Cette initiative citoyenne, menée par des bénévoles locaux, vise à améliorer l\'accès à l\'eau pour plus de 500 familles.',
    category: 'communauté',
    author: {
      name: 'Fatou Camara'
    },
    image: 'https://images.unsplash.com/photo-1768885510527-a11bcf2aa7ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBtZWV0aW5nJTIwcGVvcGxlfGVufDF8fHx8MTc3MTc3NjczOXww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

async function seedDatabase() {
  console.log('Seeding database with initial posts...');
  
  try {
    for (const post of mockPosts) {
      const response = await fetch('http://localhost:3000/make-server-462e692b/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbmRwc2hxZ3N5c3NocnNnb2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjcyMjEsImV4cCI6MjA4NzM0MzIyMX0.etmmgfdvSmEsNXEKQX1qoKwpi9cEmPm6yFKtcCL_hag'
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category,
          authorName: post.author.name,
          image: post.image
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating post:', error);
        return false;
      }
      
      const result = await response.json();
      console.log('Post created:', result.post.title);
    }
    
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

seedDatabase().then(success => {
  console.log('Seeding completed:', success);
});
