export type ActionReturn<T> = Promise<
  | {
      success: true;
      data: T;
      errors?: never;
    }
  | {
      success: false;
      data?: never;
      errors: Record<string, string[]> | string;
    }
>;
