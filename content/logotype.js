import Icon from "../components/Icon.js";
import { iconset } from "../icons/iconset.js";

export default function Logotype() {

    const generalPathAttributes = 'fill="none" stroke-width="32" stroke-linejoin="round"';

    const logoSets = {
        viewBox: "-18 -18 548 548",
        defs: [
            {
                tagName: "linearGradient",
                attrs: 'id="z-logo-gradient" x1="0.2" x2="0.8" y1="0" y2="1"',
                stops: [
                    '<stop class="z-logo-gradient-start" offset="20%"></stop>',
                    '<stop class="z-logo-gradient-center" offset="50%"></stop>',
                    '<stop class="z-logo-gradient-end" offset="80%"></stop>'
                ]
            },
            {
                tagName: "linearGradient",
                attrs: 'id="p-logo-gradient" x1="0" x2="0" y1="0" y2="1"',
                stops: [
                    '<stop class="p-logo-gradient-start" offset="20%"></stop>',
                    '<stop class="p-logo-gradient-center" offset="50%"></stop>',
                    '<stop class="p-logo-gradient-end" offset="80%"></stop>'
                ]
            }
        ],
        pathesAttributes: [
            'class="z-logo__circle"',
            `class="z-logo__figure" stroke="#ffffff" ${generalPathAttributes}`,
            `class="z-logo__p" stroke="url(#p-logo-gradient)" ${generalPathAttributes}`,
            `class="z-logo__z" stroke="url(#z-logo-gradient)" ${generalPathAttributes}`
        ]
    }
    return Icon(iconset.zLogo, "z-logo", logoSets)
}

