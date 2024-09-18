import z from 'zod'

export const envSchema = z.object({
    DATABASE_URL: z.string().url()
})

export const createUserSchema = z.object({
    name: z.string().min(1, "O nome do usuário não pode estar vazio."),
    email: z.string().email(),
    password: z.string().min(6, "A senhora do usuário precisa ter pelo menos 6 caracteres.")
})

export const createGoalSchema = z.object({
    userId: z.string(),
    title: z.string().min(2),
    desiredWeeklyFrequency: z.number().min(1).max(7)
})

export const createCompletionSchema = z.object({
    goalId: z.string()
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});