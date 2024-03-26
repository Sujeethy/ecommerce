import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();



const addUserToCategory = async (userId, categoryId) => {

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
  
    if (!user || !category) {
      throw new Error('User or category not found');
    }
  

    await prisma.category.update({
      where: { id: categoryId },
      data: { users: { connect: { id: userId } } },
    });
  
    console.log('User added to category successfully');
  };
  

  addUserToCategory(1, 2)
    .catch(error => console.error('Error adding user to category:', error));
  