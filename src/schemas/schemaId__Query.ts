import { z } from "zod";

export default z.string().trim().min(3);
