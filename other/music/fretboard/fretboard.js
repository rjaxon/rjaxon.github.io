function clear(id) {
    let parent = document.getElementById(id);
    while (parent && parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function clearNotes() {
    let strings = ['low-e', 'a', 'd', 'g', 'b', 'high-e'];

    strings.forEach((s) => {
        let parent = document.getElementById(`string-${s}`);
        while (parent && parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    });
}

function loadPatterns(options) {

    if (0 == document.getElementsByClassName('bars').length) {
        drawFret();
    }

    let strings = ['low-e', 'a', 'd', 'g', 'b', 'high-e'].reverse();
    let keys = getNoteData();
    strings.forEach((s, i) => drawPattern(s, i, keys, options));
}

function loadNotes(options) {
    let strings = ['low-e', 'a', 'd', 'g', 'b', 'high-e'].reverse();

    let major_key = options.key;

    let keys = getNoteData();

    const MINOR = 1;
    const PENTATONIC = 2;
    const BLUES = 4;

    let k = major_key || 'C';

    if (0 == document.getElementsByClassName('bars').length) {
        drawStaff();
    }

    strings.forEach((s, i) => drawNotes(s, i, keys, options));
}

function drawFret() {
    let header = document.getElementById('fretboard-header');

    let createImage = (left, top) => {
        let img = document.createElement('img');
        img.style.position = 'absolute';
        img.style.top = `${(top || -10)}px`;
        img.style.left = `${left}px`;
        img.style.width = '50px';
        img.src = '../svg/dot-single.svg';
        return img;
    }

    header.appendChild(createImage(222));
    header.appendChild(createImage(351));
    header.appendChild(createImage(482));
    header.appendChild(createImage(617));
    let span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.top = '-10px';
    span.style.left = `${814}px`;
    span.style.width = '50px';
    span.appendChild(createImage(0, -7));
    span.appendChild(createImage(0, 7));
    header.appendChild(span);

    let div = document.createElement('div');
    div.style.width = '1075px';
    div.style.height = '180px';
    div.style.background = '#ffffe0';


    let fb = document.getElementById('fretboard');
    let bg = document.createElement('img');
    bg.src = '../svg/my-fretboard-bg.svg';

    div.appendChild(bg);
    fb.appendChild(div);

}

function drawStaff() {

    let pos = [
        [3, 237],
        [5, 371],
        [7, 501],
        [9, 634],
        [12, 823]
    ];
    let header = document.getElementById('fretboard-header');
    pos.forEach((p) => {
        let span = document.createElement('span');
        span.classList.add('header');
        span.style.left = `${p[1]}px`;
        span.innerHTML = p[0];

        header.appendChild(span);
    });

    let strings = ['low-e', 'a', 'd', 'g', 'b', 'high-e'].reverse();
    let fb = document.getElementById('fretboard');
    strings.forEach((s, index) => {
        let item = document.createElement('div');
        item.id = `string-${s}`;
        item.classList.add('bars');
        fb.appendChild(item);
    });
}

function drawPattern(s, index, keys, options) {
    let k = options.key || 'C';
    let notes = keys.board[k][index];
    let fretboard = document.getElementById('fretboard');


    if (notes) {
        for (let fret = 0; fret < notes.length; ++fret) {
            n = notes[fret];
            if (n) {

                let valid_notes = getValidNotes(options, n);

                let note_plain = n.replace(/\d+/g, '');
                let interval = 1 + keys.scale[k].indexOf(note_plain)

                if (valid_notes.indexOf(interval) < 0) {
                    continue;
                }


                // console.log(s + ' ' + fret + ' ' + n );

                addPatternItem(interval, s, fret, fretboard);

            }
        }
    }
}

function drawNotes(s, index, keys, options) {

    let k = options.key || 'C';
    let notes = keys.board[k][index];
    if (notes) {
        for (let fret = 0; fret < 14 /*notes.length*/ ; ++fret) {
            n = notes[fret];
            if (n) {
                let note_plain = n.replace(/\d+/g, '');

                let interval = 1 + keys.scale[k].indexOf(note_plain)

                if (options) {

                    let valid_notes = " 1 2 3 4 5 6 7 ";

                    if (options.triads) {
                        valid_notes = " 1 3 5 ";
                    } else if (options.pentatonic || options.blues) {
                        valid_notes = " 1 2 3 5 6 ";

                        if (options.blues && interval == 3) {
                            if (fret - 1 > 0) {
                                if (n.indexOf('.') > 0) {
                                    let _n = n;
                                    if (n.indexOf('.f').length > 0) {
                                        // _n = keys.scale[k].indexOf(note_plain - 1);
                                        _n = String.fromCharCode('b'.charCodeAt(0) - 1)
                                    }
                                    addNote(s, _n.split('.')[0], fret - 1, 0, interval);
                                } else {
                                    addNote(s, n, fret - 1, 2, interval);
                                }
                            }
                        }
                    }

                    if (valid_notes.indexOf(interval) < 0) {
                        continue;
                    }
                }

                let _n = n.split('.');
                let a = 0;
                if (_n.length > 1) {
                    switch (_n[1]) {
                        case 's':
                            a = 1;
                            break;
                        case 'f':
                            a = 2;
                            break;
                    }
                }
                addNote(s, _n[0], fret, a, interval);
            }
        }
    }
}

function getValidNotes(options) {
    let valid_notes = " 1 2 3 4 5 6 7 ";

    if (options.triads) {
        valid_notes = " 1 3 5 ";
    } else if (options.pentatonic || options.blues) {
        valid_notes = " 1 2 3 5 6 ";
    }


    return valid_notes;
}

function addPatternItem(interval, s, fret, fretboard) {
    let tops = {
        "high-e": 28,
        "b": 63,
        "g": 98,
        "d": 133,
        "a": 168,
        "low-e": 203,
    };
    let lefts = [
        19, 98, 158, 225,
        292, 355, 424, 487,
        553, 620, 687, 751,
        819, 887, 948, 1015
    ];

    let span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.top = `${tops[s]}px`;
    span.style.left = `${lefts[fret]}px`;
    span.setAttribute('title', n.toUpperCase());

    let bg = document.createElement('span');
    bg.classList.add('pattern-bg');
    span.appendChild(bg);

    let img = document.createElement('img');
    img.setAttribute('width', '42');
    img.style.position = 'absolute';
    let color = '';
    if (interval == 1) {
        color = '-red';
    } else if (interval == 6) {
        color = '-green';
    }
    img.src = `../svg/number${interval}${color}.svg`;

    span.appendChild(img);
    fretboard.appendChild(span);
}


function addNote(string, note, fret, accidental /*1 sharp, 2 flat, 3 natural */ , interval) {

    if (!note) return;

    let notes = {
        // [ top, 
        //   bar {1: low-1, 2: low-2, 3: low-3, 4: high-1, 5: high-2, 6: high-3},
        // ]
        e1: [66, 3],
        f1: [62, 3],
        g1: [58, 2],
        a1: [54, 2],
        b1: [50, 1],
        c1: [46, 1],
        d1: [42, 0],

        e2: [38, 0],
        f2: [34, 0],
        g2: [30, 0],
        a2: [26, 0],
        b2: [22, 0],
        c2: [18, 0],
        d2: [14, 0],

        e3: [10, 0],
        f3: [6, 0],
        g3: [2, 0],
        a3: [-1, 4],
        b3: [-5, 4],
        c3: [-8, 5],
        d3: [-12, 5],

        e4: [-16, 6],
        f4: [-20, 6],
        g4: [2, 0],
        a4: [-1, 4],
        b4: [-5, 4],
        c4: [-8, 5],
        d4: [-12, 5]
    };

    let frets = [30, 104, 167, 234, 300, 367, 432, 497, 565, 629, 695, 760, 827, 893];

    let n = notes[note];
    if (n && n.length) {
        let container = document.createElement('span');
        container.classList.add('note-container');
        container.style.top = `${n[0]}px`;
        container.style.left = `${frets[fret]}px`;

        let extra_bars = null;
        if (n.length > 1) {
            let createExtra = function(left, top) {
                let extra = document.createElement('img');
                extra.style.position = 'absolute';
                extra.src = '../svg/my-staff-bar.svg';
                if (left)
                    extra.style.left = `${left}px`;
                if (top)
                    extra.style.top = `${top}px`;
                return extra;
            }
            switch (n[1]) {
                case 1:
                    extra_bars = [createExtra(frets[fret] + 3, 46)];
                    break;
                case 2:
                    extra_bars = [
                        createExtra(frets[fret] + 3, 46),
                        createExtra(frets[fret] + 3, 54)
                    ];
                    break;
                case 3:
                    extra_bars = [
                        createExtra(frets[fret] + 3, 46),
                        createExtra(frets[fret] + 3, 54),
                        createExtra(frets[fret] + 3, 62)
                    ];
                    break;
                case 4:
                    extra_bars = [createExtra(frets[fret] + 3, -1)];
                    break;
                case 5:
                    extra_bars = [
                        createExtra(frets[fret] + 3, -1),
                        createExtra(frets[fret] + 3, -8),
                    ];
                    break;
                case 6:
                    extra_bars = [
                        createExtra(frets[fret] + 3, -1),
                        createExtra(frets[fret] + 3, -8),
                        createExtra(frets[fret] + 3, -16)
                    ];
                    break;
            }

        }

        if (accidental) {
            let span2 = document.createElement('span');
            span2.classList.add('accidental');
            let acc = '';
            switch (accidental) {
                case 1:
                    acc = 'sharp';
                    break;
                case 2:
                    acc = 'flat';
                    break;
                case 3:
                    acc = 'natural';
                    break;
            }
            span2.classList.add(acc);
            span2.innerHTML = `&${acc};`;
            container.appendChild(span2);
        }

        let img = document.createElement('img');
        img.src = '../svg/my-note.svg';
        switch (interval) {
            case 1:
                img.src = '../svg/my-note-red.svg';
                break;
            case 6:
                img.src = '../svg/my-note-green.svg';
                break;
        }
        img.classList.add('note');
        let _note = note.toUpperCase();
        if (accidental) {
            if (accidental == 1) _note += '.s';
            if (accidental == 2) _note += '.f';
        }
        img.alt = container.title = _note;

        container.appendChild(img);


        let _string = document.getElementById(`string-${string}`);
        if (_string) {
            if (extra_bars)
                extra_bars.forEach((b) => {
                    _string.appendChild(b);
                });
            _string.appendChild(container);
        }
    }
}

// TODO: lookup tone.js
// function playTone() {
//     const synth = new Tone.Synth().toDestination();
//     synth.triggerAttackRelease("C4", "8n"); // Play middle C for an eighth note
// }


function init() {
    let controls = document.getElementsByTagName('my-notes-fretboard');

    for (let i = 0; i < controls.length; ++i) {
        let c = controls[i];
        let parent = c.parentNode;
        let div = document.createElement('div');
        div.innerHTML = '<!-- control to add html to be implemented -->';
        parent.replaceChild(div, c);
    }

}

let strings = ['low-e', 'a', 'd', 'g', 'b', 'high-e'];

function getNoteData() {

    let key = {
        scale: {},
        board: {}
    };

    key.scale.C = [ 'c', 'd', 'e', 'f', 'g', 'a', 'b' ];
    key.board.C = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',   'f3',      0,   'g3',      0,   'a3',      0,   'b3',    'c3',     0,   'd3',      0,   'e4',   'f4',      0,  'g4' ],                     
    [   'b2',   'c2',      0,   'd2',      0,   'e3',   'f3',      0,    'g3',     0,   'a3',      0,   'b3',   'c3',      0,  'd3' ],                     
    [   'g2',      0,   'a2',      0,   'b2',   'c2',      0,   'd2',       0,  'e3',   'f3',      0,   'g3',      0,   'a3',     0 ],
    [   'd1',      0,   'e2',   'f2',      0,   'g2',      0,   'a2',       0,  'b2',   'c2',      0,   'd2',      0,   'e3',  'f3' ],
    [   'a1',      0,   'b1',   'c1',      0,   'd1',      0,   'e2',    'f2',     0,   'g2',      0,   'a2',      0,   'b2',  'c2' ],
    [   'e1',   'f1',      0,   'g1',      0,   'a1',      0,   'b1',    'c1',     0,   'd1',      0,   'e2',   'f2',      0,  'g2' ],
    ];
    
    key.scale.G = [ 'g', 'a', 'b', 'c', 'd', 'e', 'f.s' ];
    key.board.G = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',      0, 'f3.s',   'g3',      0,   'a3',      0,   'b3',   'c3',      0,   'd3',      0,  'e4',       0, 'f3.s',   'g3' ],                     
    [   'b2',   'c2',      0,   'd2',      0,   'e3',      0, 'f3.s',   'g3',      0,   'a3',      0,  'b3',    'c3',      0,   'd2' ],                     
    [   'g2',      0,   'a2',      0,   'b2',   'c2',      0,   'd2',      0,   'e3',      0, 'f3.s',  'g3',       0,   'a2',      0 ],
    [   'd1',      0,   'e2',      0, 'f2.s',   'g2',      0,   'a2',      0,   'b2',   'c2',      0,  'd2',       0,   'e2',      0 ],
    [   'a1',      0,   'b1',   'c1',      0,   'd1',      0,   'e2',      0, 'f2.s',   'g2',      0,  'a2',       0,   'b1',   'c1' ],
    [   'e1',      0, 'f1.s',   'g1',      0,   'a1',      0,   'b1',   'c1',      0,   'd1',      0,  'e2',       0, 'f1.s',   'g1' ],
    ];
    
    key.scale.D = [ 'd', 'e', 'f.s', 'g', 'a', 'b', 'c.s' ];
    key.board.D = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',      0, 'f3.s',   'g3',      0,   'a3',      0,   'b3',      0, 'c3.s',   'd3',      0,  'e4',       0, 'f3.s',   'g3' ],                     
    [   'b2',      0, 'c2.s',   'd2',      0,   'e3',      0, 'f3.s',   'g3',      0,   'a3',      0,  'b3',       0, 'c2.s',   'd2' ],                     
    [   'g2',      0,   'a2',      0,   'b2',      0, 'c2.s',   'd2',      0,   'e3',      0, 'f3.s',  'g3',       0,   'a2',      0 ],
    [   'd1',      0,   'e2',      0, 'f2.s',   'g2',      0,   'a2',      0,   'b2',      0, 'c2.s',  'd2',       0,   'e2',      0 ],
    [   'a1',      0,   'b1',      0, 'c1.s',   'd1',      0,   'e2',      0, 'f2.s',   'g2',      0,  'a2',       0,   'b1',      0 ],
    [   'e1',      0, 'f1.s',   'g1',      0,   'a1',      0,   'b1',      0, 'c1.s',   'd1',      0,  'e2',       0, 'f1.s',   'g1' ],
    ];
    
    key.scale.A = [ 'a', 'b', 'c.s', 'd', 'e', 'f.s', 'g.s' ];
    key.board.A = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',      0, 'f3.s',      0, 'g3.s',   'a3',      0,   'b3',      0, 'c3.s',   'd3',      0,  'e4',       0, 'f3.s',      0 ],                     
    [   'b2',      0, 'c2.s',   'd2',      0,   'e3',      0, 'f3.s',      0, 'g3.s',   'a3',      0,  'b3',       0, 'c2.s',   'd2' ],                     
    [      0, 'g2.s',   'a2',      0,   'b2',      0, 'c2.s',   'd2',      0,   'e3',      0, 'f3.s',     0,  'g3.s',   'a2',      0 ],
    [   'd1',      0,   'e2',      0, 'f2.s',      0, 'g2.s',   'a2',      0,   'b2',      0, 'c2.s',  'd2',       0,   'e2',      0 ],
    [   'a1',      0,   'b1',      0, 'c1.s',   'd1',      0,   'e2',      0, 'f2.s',      0, 'g2.s',  'a2',       0,   'b1',      0 ],
    [   'e1',      0, 'f1.s',      0, 'g1.s',   'a1',      0,   'b1',      0, 'c1.s',   'd1',      0,  'e2',       0, 'f1.s',      0 ],
    ];
    
    key.scale.E = [ 'e', 'f.s', 'g.s', 'a', 'b', 'c.s', 'd.s' ];
    key.board.E = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',      0, 'f3.s',      0, 'g3.s',   'a3',      0,   'b3',      0, 'c3.s',      0, 'd3.s',  'e4',       0, 'f3.s',      0 ],                     
    [   'b2',      0, 'c2.s',      0, 'd2.s',   'e3',      0, 'f3.s',      0, 'g3.s',   'a3',      0,  'b3',       0, 'c2.s',      0 ],                     
    [      0, 'g2.s',   'a2',      0,   'b2',      0, 'c2.s',      0, 'd2.s',   'e3',      0, 'f3.s',     0,  'g3.s',   'a2',      0 ],
    [      0, 'd1.s',   'e2',      0, 'f2.s',      0, 'g2.s',   'a2',      0,   'b2',      0, 'c2.s',     0,  'd2.s',   'e2',      0 ],
    [   'a1',      0,   'b1',      0, 'c1.s',      0, 'd1.s',   'e2',      0, 'f2.s',      0, 'g2.s',  'a2',       0,   'b1',      0 ],
    [   'e1',      0, 'f1.s',      0, 'g1.s',   'a1',      0,   'b1',      0, 'c1.s',      0, 'd1.s',  'e2',       0, 'f1.s',      0 ],
    ];
    
    key.scale.B = [ 'b', 'c.s', 'd.s', 'e', 'f.s', 'g.s', 'a.s' ];
    key.board.B = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',      0, 'f3.s',      0, 'g3.s',      0, 'a3.s',   'b3',      0, 'c3.s',      0, 'd3.s',  'e4',       0, 'f3.s',      0 ],                     
    [   'b2',      0, 'c2.s',      0, 'd2.s',   'e3',      0, 'f3.s',      0, 'g3.s',      0, 'a3.s',  'b3',       0, 'c2.s',      0 ],                     
    [      0, 'g2.s',      0, 'a2.s',   'b2',      0, 'c2.s',      0, 'd2.s',   'e3',      0, 'f3.s',     0,  'g3.s',      0, 'a2.s' ],
    [      0, 'd1.s',   'e2',      0, 'f2.s',      0, 'g2.s',      0, 'a2.s',   'b2',      0, 'c2.s',     0,  'd2.s',   'e2',      0 ],
    [      0, 'a1.s',   'b1',      0, 'c1.s',      0, 'd1.s',   'e2',      0, 'f2.s',      0, 'g2.s',     0,  'a2.s',   'b1',      0 ],
    [   'e1',      0, 'f1.s',      0, 'g1.s',      0, 'a1.s',   'b1',      0, 'c1.s',      0, 'd1.s',  'e2',       0, 'f1.s',      0 ],
    ];
    
    key.scale.Cf = [];
    key.board.Cf = [];
    
    key.scale.F = [ 'f', 'g', 'a', 'b.f', 'c', 'd', 'e' ];
    key.board.F = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [   'e3',   'f3',      0,   'g3',      0,   'a3', 'b3.f',      0,   'c3',      0,   'd3',      0,   'e4',   'f4',      0,   'g4' ],                     
    [      0,   'c2',      0,   'd2',      0,   'e3',   'f3',      0,   'g3',      0,   'a3', 'b3.f',      0,   'c3',      0,   'd3' ],                     
    [   'g2',      0,   'a2', 'b2.f',      0,   'c2',      0,   'd2',      0,   'e3',   'f3',      0,   'g3',      0,   'a3', 'b3.f' ],
    [   'd1',      0,   'e2',   'f2',      0,   'g2',      0,   'a2', 'b2.f',      0,   'c2',      0,   'd2',      0,   'e3',   'f3' ],
    [   'a1', 'b1.f',      0,   'c1',      0,   'd1',      0,   'e2',   'f2',      0,   'g2',      0,   'a2', 'b2.f',      0,   'c2' ],
    [   'e1',   'f1',      0,   'g1',      0,   'a1', 'b1.f',      0,   'c1',      0,   'd1',      0,   'e2',   'f2',      0,   'g2' ],
    ];
    
    key.scale.Bf= [ 'b.f', 'c', 'd', 'e.f', 'f', 'g', 'a' ];
    key.board.Bf = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [      0,   'f3',      0,   'g3',      0,   'a3', 'b3.f',      0,   'c3',      0,   'd3', 'e4.f',      0,   'f4',      0,   'g3' ],                     
    [      0,   'c2',      0,   'd2', 'e3.f',      0,   'f3',      0,   'g3',      0,   'a3', 'b3.f',      0,   'c3',      0,   'd2' ],                     
    [   'g2',      0,   'a2', 'b2.f',      0,   'c2',      0,   'd2', 'e3.f',      0,   'f3',      0,   'g3',      0,   'a2', 'b2.f' ],
    [   'd1', 'e2.f',      0,   'f2',      0,   'g2',      0,   'a2', 'b2.f',      0,   'c2',      0,   'd2', 'e3.f',      0,   'f2' ],
    [   'a1', 'b1.f',      0,   'c1',      0,   'd1', 'e2.f',      0,   'f2',      0,   'g2',      0,   'a2', 'b2.f',      0,   'c1' ],
    [      0,   'f1',      0,   'g1',      0,   'a1', 'b1.f',      0,   'c1',      0,   'd1', 'e2.f',      0,   'f2',      0,   'g1' ],
    ];
    
    key.scale.Ef= [ 'e.f', 'f', 'g', 'a.f', 'b.f', 'c', 'd' ];
    key.board.Ef = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [      0,   'f3',      0,   'g3', 'a3.f',      0, 'b3.f',      0,   'c3',      0,   'd3', 'e4.f',      0,   'f4',      0,   'g3' ],                     
    [      0,   'c2',      0,   'd2', 'e3.f',      0,   'f3',      0,   'g3', 'a3.f',      0, 'b3.f',      0,   'c3',      0,   'd2' ],                     
    [   'g2', 'a2.f',      0, 'b2.f',      0,   'c2',      0,   'd2', 'e3.f',      0,   'f3',      0,   'g3', 'a3.f',      0, 'b2.f' ],
    [   'd1', 'e2.f',      0,   'f2',      0,   'g2', 'a2.f',      0, 'b2.f',      0,   'c2',      0,   'd2', 'e3.f',      0,   'f2' ],
    [      0, 'b1.f',      0,   'c1',      0,   'd1', 'e2.f',      0,   'f2',      0,   'g2', 'a2.f',      0, 'b2.f',      0,   'c1' ],
    [      0,   'f1',      0,   'g1', 'a1.f',      0, 'b1.f',      0,   'c1',      0,   'd1', 'e2.f',      0,   'f2',      0,   'g1' ],
    ];
    
    key.scale.Af= [ 'a.f', 'b.f', 'c', 'd.f', 'e.f', 'f', 'g' ];
    key.board.Af = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [      0,   'f3',      0,   'g3', 'a3.f',      0, 'b3.f',      0,   'c3', 'd3.f',      0, 'e4.f',      0,   'f4',      0,   'g3' ],                     
    [      0,   'c2', 'd2.f',      0, 'e3.f',      0,   'f3',      0,   'g3', 'a3.f',      0, 'b3.f',      0,   'c3', 'd2.f',      0 ],                     
    [   'g2', 'a2.f',      0, 'b2.f',      0,   'c2', 'd2.f',      0, 'e3.f',      0,   'f3',      0,   'g3', 'a3.f',      0, 'b2.f' ],
    [      0, 'e2.f',      0,   'f2',      0,   'g2', 'a2.f',      0, 'b2.f',      0,   'c2', 'd2.f',      0, 'e3.f',      0,   'f2' ],
    [      0, 'b1.f',      0,   'c1', 'd1.f',      0, 'e2.f',      0,   'f2',      0,   'g2', 'a2.f',      0, 'b2.f',      0,   'c1' ],
    [      0,   'f1',      0,   'g1', 'a1.f',      0, 'b1.f',      0,   'c1', 'd1.f',      0, 'e2.f',      0,   'f2',      0,   'g1' ],
    ];
    
    key.scale.Df= [ 'd.f', 'e.f', 'f', 'g.f', 'a.f', 'b.f', 'c' ];
    key.board.Df = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [      0,   'f3', 'g3.f',      0, 'a3.f',      0, 'b3.f',      0,   'c3', 'd3.f',      0, 'e4.f',      0,   'f4', 'g3.f',      0 ],                     
    [      0,   'c2', 'd2.f',      0, 'e3.f',      0,   'f3', 'g3.f',      0, 'a3.f',      0, 'b3.f',      0,   'c3', 'd2.f',      0 ],                     
    [      0, 'a2.f',      0, 'b2.f',      0,   'c2', 'd2.f',      0, 'e3.f',      0,   'f3', 'g3.f',      0, 'a3.f',      0, 'b2.f' ],
    [      0, 'e2.f',      0,   'f2', 'g2.f',      0, 'a2.f',      0, 'b2.f',      0,   'c2', 'd2.f',      0, 'e3.f',      0,   'f2' ],
    [      0, 'b1.f',      0,   'c1', 'd1.f',      0, 'e2.f',      0,   'f2', 'g2.f',      0, 'a2.f',      0, 'b3.f',      0,   'c1' ],
    [      0,   'f1', 'g1.f',      0, 'a1.f',      0, 'b1.f',      0,   'c1', 'd1.f',      0, 'e2.f',      0,   'f2', 'g1.f',      0 ],
    ];
    
    key.scale.Cs = [];
    key.board.Cs = [];
    
    key.scale.Gf= [ 'g.f', 'a.f', 'b.f', 'c.f', 'd.f', 'e.f', 'f' ];
    key.board.Gf = [
    /*------,-------,-------,---3---,-------,---5---,-------,---7---,-------,---9---,-------,-------,--12---,-------,-------,-------,*/
    [      0,   'f3', 'g3.f',      0, 'a3.f',      0, 'b3.f', 'c3.f',      0, 'd3.f',      0, 'e4.f',      0,   'f4', 'g3.f',      0 ],                     
    [ 'c2.f',      0, 'd2.f',      0, 'e3.f',      0,   'f3', 'g3.f',      0, 'a3.f',      0, 'b3.f', 'c3.f',     0 , 'd2.f',      0 ],                     
    [      0, 'a2.f',      0, 'b2.f', 'c2.f',      0, 'd2.f',      0, 'e3.f',      0,   'f3', 'g3.f',      0, 'a3.f',      0, 'b2.f' ],
    [      0, 'e2.f',      0,   'f2', 'g2.f',      0, 'a2.f',      0, 'b2.f', 'c2.f',      0, 'd2.f',      0, 'e3.f',      0,   'f2' ],
    [      0, 'b1.f', 'c1.f',      0, 'd1.f',      0, 'e2.f',      0,   'f2', 'g2.f',      0, 'a2.f',      0, 'b3.f', 'c1.f',      0 ],
    [      0,   'f1', 'g1.f',      0, 'a1.f',      0, 'b1.f', 'c1.f',      0, 'd1.f',      0, 'e2.f',      0,   'f2', 'g1.f',      0 ],
    ];
    
    key.scale.Fs = [];
    key.board.Fs = [];


    return key;
}
