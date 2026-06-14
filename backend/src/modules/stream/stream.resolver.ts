import { Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';

@Resolver()
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}
}
