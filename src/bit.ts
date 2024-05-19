import Peano from "./peano";

// -------------------------
// bit ops
type BitOr<B, C> = B extends `${infer BH}${infer BR}`
  ? C extends `${infer CH}${infer CR}`
    ? CH extends `1`
      ? `1${BitOr<BR, CR>}`
      : BH extends `1`
        ? `1${BitOr<BR, CR>}`
        : `0${BitOr<BR, CR>}`
    : ``
  : ``;
// test
const bitor1: BitOr<`1`, `1`> = `1`;
const bitor2: BitOr<`1`, `0`> = `1`;
const bitor3: BitOr<`0`, `1`> = `1`;
const bitor4: BitOr<`0`, `0`> = `0`;
const bitor5: BitOr<`010`, `000`> = `010`;
const bitor6: BitOr<`111`, `111`> = `111`;
const bitor7: BitOr<`110`, `110`> = `110`;
const bitor8: BitOr<`000`, `000`> = `000`;

type BitAnd<B, C> = B extends `${infer BH}${infer BR}`
  ? C extends `${infer CH}${infer CR}`
    ? CH extends `1`
      ? BH extends `1`
        ? `1${BitAnd<BR, CR>}`
        : `0${BitAnd<BR, CR>}`
      : `0${BitAnd<BR, CR>}`
    : ``
  : ``;
// test
const bitand1: BitAnd<`1`, `1`> = `1`;
const bitand2: BitAnd<`1`, `0`> = `0`;
const bitand3: BitAnd<`0`, `1`> = `0`;
const bitand4: BitAnd<`0`, `0`> = `0`;
const bitand5: BitAnd<`010`, `000`> = `000`;
const bitand6: BitAnd<`111`, `111`> = `111`;
const bitand7: BitAnd<`110`, `110`> = `110`;
const bitand8: BitAnd<`000`, `000`> = `000`;

type BitXor<B, C> = B extends `${infer BH}${infer BR}`
  ? C extends `${infer CH}${infer CR}`
    ? CH extends BH
      ? `0${BitXor<BR, CR>}`
      : `1${BitXor<BR, CR>}`
    : ``
  : ``;
// test
const bitxor1: BitXor<`1`, `1`> = `0`;
const bitxor2: BitXor<`1`, `0`> = `1`;
const bitxor3: BitXor<`0`, `1`> = `1`;
const bitxor4: BitXor<`0`, `0`> = `0`;
const bitxor5: BitXor<`010`, `000`> = `010`;
const bitxor6: BitXor<`111`, `111`> = `000`;
const bitxor7: BitXor<`110`, `110`> = `000`;
const bitxor8: BitXor<`000`, `000`> = `000`;
const bitxor9: BitXor<`101`, `001`> = `100`;

type BitShiftLeft<B> = B extends `${infer H}`
  ? `${H}0` extends `${infer C}${infer D}`
    ? D
    : never
  : never;
// test
const bitshiftl0: BitShiftLeft<`1111`> = `1110`;
const bitshiftl1: BitShiftLeft<`0000`> = `0000`;
const bitshiftl2: BitShiftLeft<`1010`> = `0100`;

type BitNot<B> = B extends `0`
  ? `1`
  : B extends `1`
    ? `0`
    : B extends `${infer H}${infer T}`
      ? `${BitNot<H>}${BitNot<T>}`
      : never;
// test
const bitnot0: BitNot<'0'> = '1'
const bitnot1: BitNot<'1'> = '0'
const bitnot2: BitNot<'11000'> = '00111'

type BitEq<B, C> = B extends C ? (C extends B ? true : false) : false;
// test
const biteq0: BitEq<'0', '0'> = true
const biteq1: BitEq<'0', '1'> = false
const biteq2: BitEq<'1', '0'> = false
const biteq3: BitEq<'1', '1'> = true

type BitLen<B, count = Peano.T0> = B extends `${infer HB}${infer TB}`
  ? HB extends "0" | "1" ? BitLen<TB, Peano.inc<count>> : never : count
// test
const bitlen0: BitLen<'00000000'> = [[[[[[[[null]]]]]]]]

type BitGthan<B, C> = Peano.gthan<BitLen<B>, BitLen<C>>
// test
const bitgthan0: BitGthan<'000', '000'> = false
const bitgthan1: BitGthan<'000', '0001'> = false
const bitgthan2: BitGthan<'0001', '000'> = true
// todo : they should be an error.
const bitgthan3: BitGthan<'', '000'> = false
const bitgthan4: BitGthan<'', ''> = false
const bitgthan5: BitGthan<'1', ''> = false

type _BitNeedFill<B, L> = Peano.min<BitLen<B>, L>
// test
const bitneedfill0: _BitNeedFill<'00000000', [[[null]]]> = [[[[[null]]]]]

type BitFill<B extends string, P = Peano.T0, F = '0'> = P extends Peano.T0 ? B : F extends '0'|'1' ? BitFill<`${F}${B}`, Peano.dec<P>, F> : never
// test
const bitfill0: BitFill<'10101', [null]> = '010101'
const bitfill1: BitFill<'10101', [[null]]> = '0010101'
const bitfill2: BitFill<'10101', [[null]], '1'> = '1110101'

type BitUniform<B extends string, C extends string> = BitGthan<B,C> extends true ? [B, BitFill<C, Peano.min<BitLen<B>, BitLen<C>>>] : [BitFill<B, Peano.min<BitLen<C>, BitLen<B>>>, C]
// test
const bituniform0: BitUniform<'1111', '00000'> = ['01111', '00000']
const bituniform1: BitUniform<'001111', '00000'> = ['001111', '000000']
const bituniform2: BitUniform<'001111', '111100'> = ['001111', '111100']
// todo : should be an error, and inconsistency in current.
// const bituniform3: BitUniform<'', '111100'> = ['000000', '111100']
// const bituniform4: BitUniform<'001111', ''> = [never, '']