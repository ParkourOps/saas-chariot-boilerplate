type Loggable<Type extends string, TypeData extends object | null> = {
    type: Type
    id: `${Type}:${string}`
    createdAt: number,
    data: TypeData
}
