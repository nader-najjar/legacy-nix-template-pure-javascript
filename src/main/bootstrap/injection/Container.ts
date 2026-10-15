import 'reflect-metadata';
import { Container, type ContainerOptions } from 'inversify';

export function createInversifyContainer(): Container {
  const containerOptions: ContainerOptions = {
    defaultScope: 'Transient',
    autobind: true
  }

  return new Container(containerOptions);
}
