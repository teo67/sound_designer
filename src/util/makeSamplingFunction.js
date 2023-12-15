export default samples => ((context, i = context.n - context.N) => {
    const _i = Math.round(i);
    if(_i < 0 || _i >= samples.length) {
        return 0;
    }
    return samples[_i];
});