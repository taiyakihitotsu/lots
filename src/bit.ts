import type Peano from "./peano";

namespace Bit {

// -------------------------
// bit ops
export type BitOr<B, C> = B extends `${infer BH}${infer BR}`
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

export type BitAnd<B, C> = B extends `${infer BH}${infer BR}`
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

export type BitXor<B, C> = B extends `${infer BH}${infer BR}`
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
const bitxor10: BitXor<`00111`, `00101`> = `00010`;

export type BitShiftLeftOne<B> = B extends `${infer H}`
  ? `${H}0` extends `${infer C}${infer D}`
    ? D
    : never
  : never;
// test
const bitshiftlg0: BitShiftLeftOne<`1111`> = `1110`;
const bitshiftlg1: BitShiftLeftOne<`0000`> = `0000`;
const bitshiftlg2: BitShiftLeftOne<`1010`> = `0100`;
// todo : N pattern, with Peano

export type BitShiftLeft<B, N> = N extends Peano.T0
  ? B
  : BitShiftLeft<BitShiftLeftOne<B>, Peano.dec<N>>;
// test
const bitshiftl0: BitShiftLeft<`1111`, [[null]]> = `1100`;
const bitshiftl1: BitShiftLeft<`0000`, [null]> = `0000`;
const bitshiftl2: BitShiftLeft<`1010`, [null]> = `0100`;
const bitshiftl3: BitShiftLeft<`1111`, [[[null]]]> = `1000`;
const bitshiftl4: BitShiftLeft<`1111`, [[[[null]]]]> = `0000`;
// fixme : should it be an error ?
const bitshiftl5: BitShiftLeft<`1111`, [[[[[null]]]]]> = `0000`;

export type BitNot<B> = B extends `0`
  ? `1`
  : B extends `1`
    ? `0`
    : B extends `${infer H}${infer T}`
      ? `${BitNot<H>}${BitNot<T>}`
      : never;
// test
const bitnot0: BitNot<"0"> = "1";
const bitnot1: BitNot<"1"> = "0";
const bitnot2: BitNot<"11000"> = "00111";

export type BitEq<B, C> = B extends ""
  ? C extends ""
    ? true
    : false
  : B extends `${infer HB}${infer TB}`
    ? C extends `${infer HC}${infer TC}`
      ? C extends B
        ? B extends C
          ? BitEq<TB, TC>
          : false
        : false
      : false
    : false;
// test
const biteq0: BitEq<"0", "0"> = true;
const biteq1: BitEq<"0", "1"> = false;
const biteq2: BitEq<"1", "0"> = false;
const biteq3: BitEq<"1", "1"> = true;
const biteq4: BitEq<"00", "10"> = false;
const biteq5: BitEq<"11", "11"> = true;
const biteq6: BitEq<"01", "10"> = false;
const biteq7: BitEq<"", "1"> = false;
const biteq8: BitEq<"0", ""> = false;
// todo : does init arg need?
const biteq9: BitEq<"", ""> = true;

export type BitLen<B, count = Peano.T0> = B extends `${infer HB}${infer TB}`
  ? HB extends "0" | "1"
    ? BitLen<TB, Peano.inc<count>>
    : never
  : count;
// test
const bitlen0: BitLen<"00000000"> = [[[[[[[[null]]]]]]]];

export type BitLenGthan<B, C> = Peano.gthan<BitLen<B>, BitLen<C>>;
// test
const bitgthan0: BitLenGthan<"000", "000"> = false;
const bitgthan1: BitLenGthan<"000", "0001"> = false;
const bitgthan2: BitLenGthan<"0001", "000"> = true;
// todo : they should be an error.
const bitgthan3: BitLenGthan<"", "000"> = false;
const bitgthan4: BitLenGthan<"", ""> = false;
const bitgthan5: BitLenGthan<"1", ""> = false;

export type _BitNeedFill<B, L> = Peano.min<BitLen<B>, L>;
// test
const bitneedfill0: _BitNeedFill<"00000000", [[[null]]]> = [[[[[null]]]]];

export type BitPadding<B extends string, P = Peano.T0, F = "0"> = P extends Peano.T0
  ? B
  : F extends "0" | "1"
    ? BitPadding<`${F}${B}`, Peano.dec<P>, F>
    : never;
// test
const bitpadding0: BitPadding<"10101", [null]> = "010101";
const bitpadding1: BitPadding<"10101", [[null]]> = "0010101";
const bitpadding2: BitPadding<"10101", [[null]], "1"> = "1110101";

export type BitUniform<B extends string, C extends string> = BitLenGthan<
  B,
  C
> extends true
  ? [B, BitPadding<C, Peano.min<BitLen<B>, BitLen<C>>>]
  : [BitPadding<B, Peano.min<BitLen<C>, BitLen<B>>>, C];
// test
const bituniform0: BitUniform<"1111", "00000"> = ["01111", "00000"];
const bituniform1: BitUniform<"001111", "00000"> = ["001111", "000000"];
const bituniform2: BitUniform<"001111", "111100"> = ["001111", "111100"];
// todo : should be an error, and inconsistency in current.
// const bituniform3: BitUniform<'', '111100'> = ['000000', '111100']
// const bituniform4: BitUniform<'001111', ''> = [never, '']

export type BitCut<B, P = Peano.T0> = P extends Peano.T0
  ? B
  : B extends `${infer H}${infer T}`
    ? BitCut<T, Peano.dec<P>>
    : never;
// test
const bitcut0: BitCut<"11111", Peano.T0> = "11111";
const bitcut1: BitCut<"11111", [null]> = "1111";
// const bitcut2: BitCut<"11111", [null]> = "111" // err
// const bitcut3: BitCut<"", [null]> = null as never

// CONSTANTS.
export type T8 = [[[[[[[[Peano.T0]]]]]]]];
export type T16 = Peano.mul<T8, [[null]]>;
export type T32 = Peano.mul<T16, [[null]]>;
export type T64 = Peano.mul<T32, [[null]]>;
export type MAX = T8;
export type _Zero = BitPadding<"0", MAX>;

// todo
export type BitIsZero<B extends string> = BitUniform<_Zero, B> extends [
  infer Z,
  infer U,
]
  ? BitEq<_Zero, U>
  : never;
// test
const bitiszero0: BitIsZero<"111"> = false;
const bitiszero1: BitIsZero<"000"> = true;

export type BitFill<
  B extends string,
  M = MAX,
  tB extends string = BitPadding<B, M>,
> = BitCut<tB, Peano.min<BitLen<tB>, M>>;

// test
const bitfill0: BitFill<"1111", MAX> = "00001111";
const bitfill1: BitFill<"0000", MAX> = "00000000";
const bitfill2: BitFill<"111", MAX> = "00000111";
const bitfill3: BitFill<"11", MAX> = "00000011";
const bitfill4: BitFill<"1", MAX> = "00000001";
// fixme : want to spit an error
const bitfill5: BitFill<"", MAX> = "00000000";

// note : unsinged
export type _BitAdd<B, C> = BitXor<B, C> extends infer _Xor
  ? BitAnd<B, C> extends infer _And
    ? BitShiftLeftOne<_And> extends string & infer _Carry extends string
      ? BitIsZero<
          BitUniform<_Carry, "0"> extends [infer _C extends string, infer _R]
            ? _C
            : never
        > extends true
        ? _Xor
        : _BitAdd<_Xor, _Carry>
      : 0
    : 1
  : 2;

// test
const _bitadd0: _BitAdd<"00111", "00101"> = "01100";
const _bitadd1: _BitAdd<"00110", "00001"> = "00111";
const _bitadd2: _BitAdd<"00000", "00000"> = "00000";
const _bitadd3: _BitAdd<"11111", "11111"> = "11110";

export type BitAdd<B extends string, C extends string, M = MAX> = BitFill<
  B,
  M
> extends infer _tB
  ? BitFill<C, M> extends infer _tC
    ? _BitAdd<_tB, _tC>
    : never
  : never;
// test
// 7,5,12
// 6,1,7
// 0,0,0
// 31,31,62
const bitadd0: BitAdd<"00111", "00101"> = "00001100";
const bitadd1: BitAdd<"00110", "00001"> = "00000111";
const bitadd2: BitAdd<"00000", "00000"> = "00000000";
const bitadd3: BitAdd<"11111", "11111"> = "00111110"; // shift.

export type BitSub<B extends string, C extends string, M = MAX> = BitAdd<
  BitFill<B, M>,
  BitAdd<BitNot<BitFill<C, M>>, BitFill<"1", M>>
>;
// test
const bitsub0: BitSub<"00111", "00101"> = "00000010";
const bitsub1: BitSub<"00110", "00001"> = "00000101";
const bitsub2: BitSub<"00000", "00000"> = "00000000";
const bitsub3: BitSub<"11111", "11111"> = "00000000";
//
// const bitsub4: BitSub<"00111", "01000"> = "00000000"
// const bitsub5: BitSub<"00000", "11111"> = "00000000"

export type BitGTE<
  B extends string
, C extends string> =
  BitSub<B,C> extends `${infer H}${infer _}`
  ? H extends '1'
    ? false
    : true
  : never

const bitsub0gte: BitGTE<"00111", "00101"> = true
const bitsub1gte: BitGTE<"00110", "00001"> = true
const bitsub2gte: BitGTE<"00000", "00000"> = true
const bitsub3gte: BitGTE<"11111", "11111"> = true
const bitsub4gte: BitGTE<"00111", "01000"> = false
const bitsub5gte: BitGTE<"00000", "11111"> = false

export type BitGT<
  B extends string
, C extends string> =
  BitGTE<B,C> extends true
  ? B extends C ? C extends B
    ? false
    : true : true
  : false

const bitsub0gt: BitGT<"00111", "00101"> = true
const bitsub1gt: BitGT<"00110", "00001"> = true
const bitsub2gt: BitGT<"00000", "00000"> = false
const bitsub3gt: BitGT<"11111", "11111"> = false
const bitsub4gt: BitGT<"00111", "01000"> = false
const bitsub5gt: BitGT<"00000", "11111"> = false

export type BitLT<
  B extends string
, C extends string> = 
  BitGTE<B,C> extends true ? false : true

const bitsub0lt: BitLT<"00111", "00101"> = false
const bitsub1lt: BitLT<"00110", "00001"> = false
const bitsub2lt: BitLT<"00000", "00000"> = false
const bitsub3lt: BitLT<"11111", "11111"> = false
const bitsub4lt: BitLT<"00111", "01000"> = true
const bitsub5lt: BitLT<"00000", "11111"> = true

export type BitLTE<
  B extends string
, C extends string> =
  BitGT<B,C> extends true ? false : true

const bitsub0lte: BitLTE<"00111", "00101"> = false
const bitsub1lte: BitLTE<"00110", "00001"> = false
const bitsub2lte: BitLTE<"00000", "00000"> = true
const bitsub3lte: BitLTE<"11111", "11111"> = true
const bitsub4lte: BitLTE<"00111", "01000"> = true
const bitsub5lte: BitLTE<"00000", "11111"> = true

export type BitMul<
  B extends string,
  C extends string,
  M = MAX,
  R extends string = BitFill<"0", M>,
  tB extends string = BitFill<B, M>,
  tC extends string = BitFill<C, M>,
  N = Peano.dec<M>,
> = tB extends `${infer H}${infer T}`
  ? H extends "/"
    ? R
    : H extends "0"
      ? BitMul<B, C, M, R, `${T}/`, tC, Peano.dec<N>>
      : H extends "1"
        ? BitMul<
            B,
            C,
            M,
            BitAdd<R, BitShiftLeft<tC, N>>,
            `${T}/`,
            tC,
            Peano.dec<N>
          >
        : never
  : never;
// test
// 7,5,35
// 6,2,12
// 0,0,0
// 31,1,31
// 1,1,1
// 0,1,0
// 1,0,0
const bitmul0: BitMul<"00111", "00101"> = "00100011";
const bitmul1: BitMul<"00110", "00010"> = "00001100";
const bitmul2: BitMul<"00000", "00000"> = "00000000";
const bitmul3: BitMul<"11111", "00001"> = "00011111";
const bitmul4: BitMul<"00001", "00001"> = "00000001";
const bitmul5: BitMul<"00000", "00001"> = "00000000";
const bitmul6: BitMul<"00001", "00000"> = "00000000";

export type _BitShiftRight<
  B extends string,
  M = MAX,
  N = Peano.T1,
  D = Peano.min<M, N>,
  R extends string = "",
> = D extends Peano.T0
  ? R extends ""
    ? B
    : R
  : B extends `${infer H}${infer T}`
    ? _BitShiftRight<`${T}`, M, N, Peano.dec<D>, `${R}${H}`>
    : R;

const bitsr0: _BitShiftRight<"111111", [[[[[[null]]]]]], [[null]]> = "1111";
const bitsr1: _BitShiftRight<"111111", [[[[[[null]]]]]], [[[null]]]> = "111";
// export type BitShiftRight
// export type UnsignedBitShiftRight

// note : 
// I think peano number 2 should be written from [[null]] to [null,null].
// If so, implementing div with comparing and add is good performance than minus or some hack.
// Because we can use concat in this case.

export type _BitDiv<
  B extends string
, C extends string
, Ret extends string = "00000000"> =
  BitLT<B,C> extends true
  ? Ret
  : _BitDiv<BitSub<B,C>, C, BitAdd<Ret, "00000001">>

// todo
export type Nil  = [`prim`, `nil`]
const nil: Nil = [`prim`, `nil`] 

export type BitDiv<
  B extends string
, C extends string> =
  BitIsZero<C> extends true
  ? Nil
  : _BitDiv<B,C>

const testbitdiv0: BitDiv<"00001001", "00000001"> = "00001001"
const testbitdiv1: BitDiv<"00001001", "00000011"> = "00000011"
const testbitdiv2: BitDiv<"00001001", "00000010"> = "00000100"
const testbitdiv3: BitDiv<"00001001", "00000000"> = nil
const testbitdiv4: BitDiv<"00000010", "00001010"> = "00000000"

export type _BitMod<
  B extends string
, C extends string
, Ret extends string = B> =
  BitLT<Ret,C> extends true
  ? Ret
  : _BitMod<B,C,BitSub<Ret,C>>

export type BitMod<
  B extends string
, C extends string> =
  BitIsZero<C> extends true
  ? Nil
  : _BitMod<B,C>

const testbitmod0: BitMod<"00001001", "00000001"> = "00000000"
const testbitmod1: BitMod<"00001001", "00000011"> = "00000000"
const testbitmod2: BitMod<"00001001", "00000010"> = "00000001"
const testbitmod3: BitMod<"00001001", "00000000"> = nil
const testbitmod4: BitMod<"00000010", "00001010"> = "00000010"
}

export default Bit
