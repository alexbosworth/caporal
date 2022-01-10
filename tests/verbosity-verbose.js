"use strict";

/* global Program, logger, should, makeArgv */

const program = new Program();

program
  .logger(logger)
  .version('1.0.0')
  .command('foo', 'My foo')
  .action(function() {
    this.debug('debug should NOT be displayed');
    this.info("This should be displayed");
    this.warn('This should be displayed');
  });


['-v', '--verbose'].forEach((opt) => {
  describe('Passing ' + opt, () => {
    it(`should output at debug level`, (done) => {
      let output = 0;
      const listener = _ => output++;
      logger.on('logging', listener);
      program.parse(makeArgv(['foo', opt]));
      setImmediate(() => {
        should(output).eql(3);
        logger.removeListener('logging', listener);
        done();
      })
    });
  });
});
