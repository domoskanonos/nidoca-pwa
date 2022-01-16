import {
  HttpClientService,
  HttpClientProperties,
} from "@domoskanonos/nidoca-http";
import { RestRepository } from "@domoskanonos/nidoca-http/lib/rest-repository";
import { Vertrag } from "../model/vertrag-model";

export class VertragRemoteRepository extends RestRepository<Vertrag, number> {
  private static uniqueInstance: VertragRemoteRepository;

  constructor() {
    const httpClientProperties: HttpClientProperties =
      new HttpClientProperties();

    httpClientProperties.baseURL = window.location.protocol
      .concat("//")
      .concat(window.location.hostname);
    httpClientProperties.baseURL = "http://192.168.178.44";
    console.log(httpClientProperties.baseURL);
    httpClientProperties.port = "8090";
    super(new HttpClientService(httpClientProperties), "/VERTRAEGE");
  }

  static getUniqueInstance(): VertragRemoteRepository {
    if (!VertragRemoteRepository.uniqueInstance) {
      VertragRemoteRepository.uniqueInstance = new VertragRemoteRepository();
    }
    return VertragRemoteRepository.uniqueInstance;
  }
}
