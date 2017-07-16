var gpHatebuCounter = com.ginpen.gpHatebuCounter;
var origin = $('<a href="/" />').prop('href');

module('units');

test('general', function() {
  ok(com.ginpen.gpHatebuCounter, 'com.ginpen.gpHatebuCounter');
  var $el = $('<a />');
  equal($el.gpHatebuCounter()[0], $el[0], 'jQuery.fn.gpHatebuCounter');
});

test('check target', function() {
  ok(gpHatebuCounter._isTarget($('<a href="#" />')), 'link');
  ok(!gpHatebuCounter._isTarget($('<a href="#" class="gphatebucounter-ignore" />')), 'link with ignore flag');
  ok(!gpHatebuCounter._isTarget($('<a />')), 'link without href attribute');
  ok(!gpHatebuCounter._isTarget($('<span />')), 'not link');
  ok(!gpHatebuCounter._isTarget($(document)), 'document');
  ok(!gpHatebuCounter._isTarget($()), 'empty');
});

test('get target url', function() {
  equal(gpHatebuCounter._getTargetUrl($('<a href="https://example.com/" />')), 'https://example.com/', 'full');
  equal(gpHatebuCounter._getTargetUrl($('<a href="/" />')), origin, 'own root');
  equal(gpHatebuCounter._getTargetUrl($('<a href="##" />')), origin + location.pathname.slice(1) + '%23%23', 'hash');
});

test('get size', function() {
  equal(gpHatebuCounter._getSize(), '', 'no settings');
  equal(gpHatebuCounter._getSize({}), '', 'empty object');
  equal(gpHatebuCounter._getSize({ size: 'xxx' }), '', 'not matched');
  equal(gpHatebuCounter._getSize({ size: 'large' }), 'large', 'large');
  equal(gpHatebuCounter._getSize({ size: 'small' }), 'small', 'small');
});

test('check link', function() {
  ok(gpHatebuCounter._isBeLinked(), '', 'no settings');
  ok(gpHatebuCounter._isBeLinked({}), '', 'empty object');
  ok(!gpHatebuCounter._isBeLinked({ link: false }), '', 'true');
});

test('check outside', function() {
  ok(gpHatebuCounter._isBeOutside(), '', 'no settings');
  ok(gpHatebuCounter._isBeOutside({}), '', 'empty object');
  ok(gpHatebuCounter._isBeOutside({ outside: false }), '', 'false');
  ok(!gpHatebuCounter._isBeOutside({ outside: false, link: false }), '', 'with link');
});

test('check position', function() {
  ok(!gpHatebuCounter._isBeBefore(), '', 'no settings');
  ok(!gpHatebuCounter._isBeBefore({}), '', 'empty object');
  ok(gpHatebuCounter._isBeBefore({ before: true }), '', 'true');
});

test('build element', function() {
  var $el = gpHatebuCounter.build($('<a href="https://example.com/" />'));
  ok($el.hasClass('gphatebucounter'), 'typical');
  ok($el.is('a'), 'typical');
  ok($el.children().is('img'), 'typical');

  var $el = gpHatebuCounter.build($('<a href="https://example.com/" />'), { link: false });
  ok($el.hasClass('gphatebucounter'), 'typical');
  ok($el.is('img'), 'link');
});

test('insert', function() {
});

test('build img element', function() {
  var $el = gpHatebuCounter._buildImg($('<a href="https://example.com/" />'));
  equal(
    $el.attr('src'),
    'https://b.hatena.ne.jp/entry/image/https://example.com/',
    'typical');
  equal(
    $el.css('border-width'),
    $('<div />').css('border-width', '0px').css('border-width'),
    'typical');
});

test('get image url', function() {
  equal(
    gpHatebuCounter._getImageUrl($('<a href="https://example.com/" />')),
    'https://b.hatena.ne.jp/entry/image/https://example.com/',
    'typical');

  equal(
    gpHatebuCounter._getImageUrl($('<a href="https://example.com/" />'), { size: 'large' }),
    'https://b.hatena.ne.jp/entry/image/large/https://example.com/',
    'size');
});

test('build a element', function() {
  var $el = gpHatebuCounter._buildLink($('<a href="https://example.com/" />'));
  equal(
    $el.attr('href'),
    'https://b.hatena.ne.jp/entry/https://example.com/',
    'typical');
});

test('get bookmark page url', function() {
  equal(
    gpHatebuCounter._getLinkUrl($('<a href="https://example.com/" />')),
    'https://b.hatena.ne.jp/entry/https://example.com/',
    'typical');
});


module('jQuery interface');

test('typical', function() {
  var $container = $('<div />');
  var $link1 = $('<a href="https://example.com/">text</a>').appendTo($container);
  var $link2 = $('<a href="https://example.net/">text</a>').appendTo($container);
  $container.children().gpHatebuCounter();
  equal($container.children().length, 4, 'typical');
  equal($link1.next().attr('href'), 'https://b.hatena.ne.jp/entry/https://example.com/', 'typical');
  equal($link2.next().attr('href'), 'https://b.hatena.ne.jp/entry/https://example.net/', 'typical');

  var $container = $('<div />');
  var $link = $('<a href="https://example.com/">text</a>').appendTo($container);
  $link.gpHatebuCounter({ before: true });
  equal($container.children().eq(0).attr('href'), 'https://b.hatena.ne.jp/entry/https://example.com/', 'before');

  var $container = $('<div />');
  var $link = $('<a href="https://example.com/">text</a>').appendTo($container);
  $link.gpHatebuCounter({
    link: false
  });
  ok($link.children().eq(0).is('img'), 'link');

  var $container = $('<div />');
  var $link = $('<a href="https://example.com/">text</a>').appendTo($container);
  $link.gpHatebuCounter({
    link: false,
    outside: true
  });
  equal($link.children().length, 0, 'outside');
  ok($container.children().eq(1).is('img'), 'outside');
});
