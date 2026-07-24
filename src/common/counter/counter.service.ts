import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from './counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,
  ) {}

  /** Tăng và trả về số thứ tự tiếp theo cho 1 key, atomic (an toàn khi nhiều request cùng lúc). */
  async getNextSequence(key: string): Promise<number> {
    const counter = await this.counterModel
      .findOneAndUpdate(
        { key },
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
      )
      .exec();
    return counter.seq;
  }
}
