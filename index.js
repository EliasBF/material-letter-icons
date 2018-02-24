#!/usr/bin/env node

var path = require('path');
var log = require('npmlog');
var config = require('./config');
var program = require('commander');
var generator = require('./lib/generator');

// Define arguments and options
program
    .version('1.0.0')
    .option('-c, --chars <$#@>', 'generate icons for custom characters (no separator)')
    .option('-p, --pair', 'generate icon for pair characters (max two characters)')
    .option('-b, --background <color>', 'background color for generated icons (hexadecimal color)')
    .option('-s, --shape <shape>', 'shape for generated icons (square|circle)')
    .option('-o, --output <directory>', 'set output directory')
    .parse(process.argv);

// Developer provide shape?
if (program.shape) {
    if (!/^(square|circle)$/.test(program.shape)) {
        return log.error('material-letter-icons', 'Generated icons shape only support square or circle.')
    }
}

// Developer didn't provide any custom characters?
if (!program.chars) {
    // Let them know it's possible to do so via CLI argument
    log.warn('material-letter-icons', 'Generating icons for the entire alphabet.');
    log.warn('material-letter-icons', 'Specify --chars XYZ to override this behavior.');
}
else {
    if (program.pair) {
        if (program.chars.length > 2) {
            return log.error('material-letter-icons', 'Pair option restrict --chars only to two characters.');
        }

        // Let them know it's possible to do so via CLI argument
        log.info('material-letter-icons', 'Generating icon for pair characters: ' + program.chars);
    }
    else {
        // Let them know it's possible to do so via CLI argument
        log.info('material-letter-icons', 'Generating icons for custom characters: ' + program.chars);
    }
}

// Set output path, (default build path to dist/ folder for convenience)
program.output = program.output ? path.resolve(program.output) : path.join(__dirname, config.dist.path);

// Generate the icons and export them to dist/
generator.generateIcons(program, function (err) {
    // Log errors
    if (err) {
        return log.error('Icon generator failed', err);
    }

    // Print out success message
    log.info('material-letter-icons', 'Icons generated successfully');
    log.info('material-letter-icons', 'Output path: ' + program.output);
});