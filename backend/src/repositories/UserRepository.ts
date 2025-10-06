import prisma from "../config/prisma";
import { User, CreateUserInput, UpdateUserInput } from "../types";

export class UserRepository {
  async create(userData: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async update(userData: UpdateUserInput): Promise<User> {
    if (!userData.id) {
      throw new Error("ID do usuário é obrigatório para atualização");
    }

    const { id, ...updateData } = userData;

    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdateData).length === 0) {
      throw new Error("Nenhum campo para atualizar");
    }

    const user = await prisma.user.update({
      where: { id },
      data: cleanUpdateData,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return user !== null;
  }
}
