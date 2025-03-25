const { RPMQueue } = require('../');

const queue = new RPMQueue(5);

for (let i = 0; i < 10; i++) {
  const num = i;

  queue.run(() => {
    console.log(num);
  });
}


queue.wait().then(() => {
  console.log('All done');
});