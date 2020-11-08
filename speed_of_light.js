const wave = {
    index: 0,
    param: {
        size: 1,
        width: 1.3,
        angle: 5,
        periodAll: 150,
        bit: 10,
        shift: 2,
        duration: .6,
        set: obj => {
            for (let key in obj) {
                wave.param[key] = obj[key];
            }
        }
    },
    all: [],
    getSvg: id => {
        let svg = wave.all.find(e => e.id == id);
        if (!svg) console.error('THERE IS NO SUCH WAVE !!!');
        console.log('%c svg:', 'background: #ffcc00; color: #003300', svg)

        return svg;
    },
    recount: id => {
        let svg = wave.getSvg(id);

        poly = svg.elem.querySelector('polygon');
        anim = svg.elem.querySelector('animate');

        let s = svg.param;
        let h = s.size * 4;

        let points = '';
        let to = '';

        for (let i = -(s.bit * 2) + s.shift; i < ((s.periodAll + 2) * s.bit); i += (s.bit * 2)) {
            points += i + ',0 ' + i + ',' + h + ' ';
            points += (i + s.bit) + ',' + h + ' ' + (i + s.bit) + ',' + '0 ';
            to += (i + (s.bit * 2)) + ',0 ' + (i + (s.bit * 2)) + ',' + h + ' ';
            to += (i + (s.bit * 3)) + ',' + h + ' ' + (i + (s.bit * 3)) + ',' + '0 ';
        }

        poly.setAttribute('points', points);
        anim.setAttribute('to', to);
    },
    relay: (id, shift) => {
        let svg = wave.getSvg(id);
        svg.param.shift = shift;

        wave.recount();
    },
    init: item => {
        let s = wave.param;
        let h = s.size * 4;
        let svgId = 'wave_' + wave.index;

        // #region [rgba(0,0,255,0.05)]
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', svgId);
        let svgSize = '0 0 ' + ((s.size * .5) + ((s.periodAll + 1.2) * s.size * 2)) + ' ' + h;
        svg.setAttribute('viewBox', svgSize);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('transform-origin', '0px ' + (s.size * 2) + 'px');
        svg.setAttribute('transform', 'rotate(' + s.angle + ')');
        item.append(svg);
        wave.all.push({
            id: svgId,
            elem: svg,
            param: {
                size: wave.param.size,
                width: wave.param.width,
                angle: wave.param.angle,
                periodAll: wave.param.periodAll,
                bit: wave.param.bit,
                shift: wave.param.shift,
                duration: wave.param.duration,
            }
        });
        // #endregion

        // #region [rgba(0,255,50,0.03)]
        let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.append(g);
        // #endregion

        // #region [rgba(255,0,0,0.06)]
        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        g.append(defs);
        // #endregion

        // #region [rgba(0,255,255,0.05)]
        let clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        let clipId = 'clip' + wave.index;
        clipPath.setAttribute('id', clipId);
        defs.append(clipPath);
        // #endregion


        // for recount
        // #region [rgba(255,255,0,0.05)]
        let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        clipPath.append(polygon);
        // #endregion

        // #region [rgba(255,0,0,0.08)]
        let animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('begin', '0s');
        animate.setAttribute('fill', 'freeze');
        animate.setAttribute('repeatCount', 'indefinite');
        animate.setAttribute('attributeName', 'points');
        animate.setAttribute('dur', s.duration + 's');
        polygon.append(animate);
        // #endregion

        wave.recount(svgId);

        // #region [rgba(255,0,255,0.05)]
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'red');
        path.setAttribute('stroke-width', s.width);
        path.setAttribute('clip-path', 'url(#' + clipId + ')');

        let d = 'M ' + (s.size * .5) + ',' + (0 + (s.size * 2)) + ' ';
        d += 'Q ' + ((s.size * .5) + s.size) + ',0 ' + ((s.size * .5) + (s.size * 2)) + ',' + (s.size * 2) + ' ';
        d += 't ';
        for (let i = 0; i < s.periodAll; i++) {
            d += (s.size * 2) + ',0 ';
        }
        path.setAttribute('d', d);

        g.append(path);
        // #endregion

        wave.index++;

        return svgId;
    }
}

wave.init(document.querySelector('#place'));
wave.param.set({
    angle: -5,
    shift: -8
});
wave.init(document.querySelector('#place'));