import { IsInt, Max, Min } from 'class-validator';

export class CapNhatN1Dto {
  @IsInt()
  @Min(0)
  @Max(8)
  n1: number;
}
