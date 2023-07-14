import { JsonController, Get } from 'routing-controllers';

@JsonController('/users')
export class UserController {
  @Get('/')
  getUser(): string {
    return 'User information';
  }
}
