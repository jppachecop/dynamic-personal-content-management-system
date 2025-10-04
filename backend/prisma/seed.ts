import prisma from "../src/config/prisma";

const seedData = async (): Promise<void> => {
  console.log("Starting database seeding...");

  try {
    // Create sample users
    console.log("Creating sample users...");
    const user1 = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
    });

    console.log("✓ Sample users created");

    // Create sample categories
    console.log("Creating sample categories...");
    const categories = [
      { name: "Work", color: "#3B82F6", icon: "💼" },
      { name: "Personal", color: "#10B981", icon: "👤" },
      { name: "Ideas", color: "#F59E0B", icon: "💡" },
      { name: "Learning", color: "#8B5CF6", icon: "📚" },
      { name: "Projects", color: "#EF4444", icon: "🚀" },
    ];

    for (const category of categories) {
      await prisma.category.create({
        data: category,
      });
    }
    console.log("✓ Sample categories created");

    // Create sample tags
    console.log("Creating sample tags...");
    const tags = [
      { name: "important", color: "#EF4444", count: 0 },
      { name: "urgent", color: "#F59E0B", count: 0 },
      { name: "meeting", color: "#3B82F6", count: 0 },
      { name: "todo", color: "#10B981", count: 0 },
      { name: "research", color: "#8B5CF6", count: 0 },
      { name: "brainstorm", color: "#F97316", count: 0 },
      { name: "review", color: "#06B6D4", count: 0 },
      { name: "follow-up", color: "#84CC16", count: 0 },
    ];

    for (const tag of tags) {
      await prisma.tag.create({
        data: tag,
      });
    }
    console.log("✓ Sample tags created");

    // Create sample notes
    console.log("Creating sample notes...");
    const notes = [
      {
        title: "Project Planning Meeting",
        content:
          "Discuss the roadmap for Q1 2024. Key topics:\n- Resource allocation\n- Timeline review\n- Risk assessment\n- Stakeholder communication",
        tags: ["meeting", "important"],
        category: "Work",
        userId: user1.id,
        isFavorite: true,
      },
      {
        title: "Book Recommendations",
        content:
          'Books to read this month:\n1. "Atomic Habits" by James Clear\n2. "The Psychology of Money" by Morgan Housel\n3. "Thinking, Fast and Slow" by Daniel Kahneman',
        tags: ["research", "todo"],
        category: "Learning",
        userId: user1.id,
        isFavorite: false,
      },
      {
        title: "Weekend Trip Ideas",
        content:
          "Places to visit:\n- Mountain hiking trails\n- Local museums\n- Beach towns within 2 hours drive\n- Wine tasting tours",
        tags: ["brainstorm"],
        category: "Personal",
        userId: user1.id,
        isFavorite: false,
      },
      {
        title: "App Feature Ideas",
        content:
          "New features to consider:\n- Dark mode toggle\n- Export to PDF\n- Collaborative editing\n- Voice notes\n- Advanced search filters",
        tags: ["brainstorm", "important"],
        category: "Ideas",
        userId: user2.id,
        isFavorite: true,
      },
      {
        title: "Weekly Review",
        content:
          "Accomplishments this week:\n- Completed user authentication\n- Fixed 5 critical bugs\n- Updated documentation\n- Conducted team retrospective",
        tags: ["review"],
        category: "Work",
        userId: user2.id,
        isFavorite: false,
      },
      {
        title: "Learning TypeScript",
        content:
          "Key concepts to master:\n- Advanced types (union, intersection)\n- Generics and constraints\n- Decorators\n- Module system\n- Error handling patterns",
        tags: ["research", "todo"],
        category: "Learning",
        userId: user2.id,
        isFavorite: true,
      },
      {
        title: "Client Follow-up",
        content:
          "Action items from client meeting:\n- Send proposal by Friday\n- Schedule technical review\n- Prepare demo environment\n- Update project timeline",
        tags: ["follow-up", "urgent"],
        category: "Work",
        userId: user1.id,
        isFavorite: false,
      },
      {
        title: "Home Improvement Tasks",
        content:
          "Tasks for this month:\n- Paint the living room\n- Fix leaky faucet\n- Organize garage\n- Plant herbs in garden",
        tags: ["todo"],
        category: "Personal",
        userId: user2.id,
        isFavorite: false,
      },
    ];

    for (const note of notes) {
      await prisma.note.create({
        data: note,
      });
    }
    console.log("✓ Sample notes created");

    // Update tag counts based on actual usage
    console.log("Updating tag counts...");
    const allTags = await prisma.tag.findMany();

    for (const tag of allTags) {
      const count = await prisma.note.count({
        where: {
          tags: {
            has: tag.name,
          },
        },
      });

      await prisma.tag.update({
        where: { id: tag.id },
        data: { count },
      });
    }
    console.log("✓ Tag counts updated");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedData };
