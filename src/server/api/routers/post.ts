import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
    hello1: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return (

        "test"+input.text
      );
    }),
    checkUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      return !!existingUser;
    }),
    login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      
      const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });
    
    if (!user) {
      
      return { error: "User not found", };
    }
    
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    
    if (!passwordMatch) {
      
      return { error: "Incorrect password" };
    }
    user.password = "";
    
    return { error: "Success", user };
    }),


    createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string(),verifed:z.boolean() }))
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (existingUser) {
        return {error:"existed"}; 
      }
      else if(!input.verifed){
       
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const newUser={email:input.email,name:input.name,password:hashedPassword}
        return(newUser)
      }
     else{

      
      const newUser = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
      return {error:"",newUser};}
    }),

    getcategories: publicProcedure
    .input(z.object({ userId:z.number(), page:z.number()}))
    .mutation(async ({ input }) => {
      try {
        
        const userId =input.userId;
        const page=input.page;
        const perPage = 6;
        const offset = (page - 1) * perPage;
    
        
        const categories = await prisma.category.findMany({
          take: perPage,
          skip: offset,
        });
    
        
        const checkedCategories = [];
        for (const category of categories) {
          const user = await prisma.user.findFirst({
            where: {
              id: userId,
              categories: { some: { id: category.id } },
            },
          });
          checkedCategories.push({
            id: category.id,
            name: category.name,
            isChecked: !!user,
          });
        }
    
        return { categories: checkedCategories };
      } catch (error) {
        return (error)
      } 

    }),

    addCategory:publicProcedure
    .input(z.object({ userId:z.number(), categoryId:z.number()}))
    .mutation(async ({ input }) => {

      const userId=input.userId;
      const categoryId =input.categoryId;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
    
      if (!user || !category) {
       return("not found user,category")
      }
    
      
      const result=await prisma.category.update({
        where: { id: categoryId },
        data: { users: { connect: { id: userId } } },
      });
      return(result)
      
    }),
    removeCategory: publicProcedure
  .input(z.object({ userId: z.number(), categoryId: z.number() }))
  .mutation(async ({ input }) => {
    const userId = input.userId;
    const categoryId = input.categoryId;

    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!user || !category) {
      return("not found user,category")
    }

    
    const result = await prisma.category.update({
      where: { id: categoryId },
      data: { users: { disconnect: { id: userId } } },
    });

    return result;
  })
  
});
