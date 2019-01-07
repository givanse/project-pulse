import Pretender from 'pretender';
import fetchProject from './fetch-project';

function jsonResponse(status: number, payload: any) {
  return [
    status,
    { 'Content-Type': 'text/json' },
    JSON.stringify(payload)
  ];
}

const setup = function() {
  this.get('/projects/bitcoin.json', function(/*request*/) {
    const payload = {id: 'bitcoin'};
    return jsonResponse(200, payload);
  });
};

const server = new Pretender(setup);

server.handledRequest = function(verb, path, request) {
  let m = `Intercepted: ${verb} ${path}`;
  m += request.params ? ` ${JSON.stringify(request.params)}` : '';
  m += request.queryParams ? ` ${JSON.stringify(request.queryParams)}` : '';
  // tslint:disable-next-line
  //console.log(m);
};

const { module, test } = QUnit;

module('Util: FetchProject', function(hooks) {
  test('it renders', async function(assert) {
    this.desc = {id: 1, name: 'bitcoin'};
    this.removeProject = () => null;
    const result = await fetchProject('bitcoin');
    assert.equal(result.id, 'bitcoin');
  });
});
