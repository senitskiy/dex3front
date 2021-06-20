const HelloEventsContract = {
    abi: {
        "ABI version": 2,
        "header": ["time", "expire"],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {"name":"text","type":"bytes"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "setHelloText",
                "inputs": [
                    {"name":"text","type":"bytes"}
                ],
                "outputs": [
                    {"name":"oldText","type":"bytes"}
                ]
            },
            {
                "name": "getHelloText",
                "inputs": [
                ],
                "outputs": [
                    {"name":"text","type":"bytes"}
                ]
            },
            {
                "name": "getTextUpdateTime",
                "inputs": [
                ],
                "outputs": [
                    {"name":"time","type":"uint32"}
                ]
            }
        ],
        "data": [
        ],
        "events": [
            {
                "name": "TextUpdated",
                "inputs": [
                    {"name":"text","type":"bytes"},
                    {"name":"time","type":"uint32"}
                ],
                "outputs": [
                ]
            }
        ]
    }
    ,
    tvc: "te6ccgECHQEABCIAAib/APSkICLAAZL0oOGK7VNsEvShBwEBCvSkIPShAgEeoAAAAAFctgu1/3BwJMEAAwEI2zxsIwQB+iTPNasCyMhwI5kwfygzITmAfzTfJZKAMJKAIOIllymALc8LBzreJKU1JJl/Mik0IjqAfzXfKHpwcG1vAo49IG9RI44QcG1vAnBvUCFvUSAycSJsUuGTI8MAjhUhpDJwbW8CXySpDAE2IgFvUDIBb1HoIG8RIG7yfzFaW9gpBQHkjlNTkbkglDApwn/f8tBCU5GhUwe7jhkgllPDzwsHPeRTcKE4J5l/NSw3JT2AfzjfjiEnllPDzwsHPeR/NSw3JT1TB6GWU8PPCwc95IB/IaEooDjiMN5TFruOFyGOEyuAMCJvEKDPCwc8IG8RIG7yfzHkBgCMjjYmjhMrgDAibxCgzwsHPCBvESBu8n8x5H80KzYkPFMWoY4TK4AwIm8QoM8LBzwgbxEgbvJ/MeTiI7OSKzaSKzXiXzVswwIBIAsIAQL/CQH+fyHtRNAg10nCAY4X0//TP9MA1NcLH/hr+Gp/+GH4Zvhj+GKOH/QFyMn4anD4a3ABgED0DvK91wv/+GJw+GNw+GZ/+GHi0wABjhKBAgDXGCD5AVj4QiD4ZfkQ8qje0z8Bjh34QyG5IJ8wIPgjgQPoqIIIG3dAoLnekvhj4DDyNAoATtjTHwH4I7zyudMfIcEDIoIQ/////byxk1vyPOAB8AH4R26TMPI83gIBIA4MAQ+8IqKWP8ILdA0C5uMA1NHIyfhFIG6SMHDe+EK68uBk+AD4SiL4avgj+GvIi9wAAAAAAAAAAAAAAAAgzxbPgc+Bz5BKmrKO+ErPFPhLzwsfyXD7ADExIcD/jiIj0NMB+kAwMcjPhyDOgGDPQM+Bz4HPkxFRSx4hzxTJcPsA3jAVGQIBIBEPAQ+7AcXPz4QW6BACYuMA0XD4SzEhwP+OIyPQ0wH6QDAxyM+HIM6AYM9Az4HPgc+SwHFz8iHPCx/JcPsA3jAVFAIBIBYSAQ+5SvFtvwgt0BMCYuMA0cjJ+EoxIcD/jiIj0NMB+kAwMcjPhyDOgGDPQM+Bz4HPkmleLbYhzxTJcPsA3jAVFAEK4wB/+GcaADTtRNDT/9M/0wDU1wsf+Gv4an/4Yfhm+GP4YgIBIBwXAQ+29pOFfhBboBgCKuMA+Ebyc3H4ZtTR+AAg+Gr4I/hrMBsZAQrbPH/4ZxoANPhCyMv/+EPPCz/4Rs8LAPhK+EsCzMsfye1UAIbtRNAg10nCAY4X0//TP9MA1NcLH/hr+Gp/+GH4Zvhj+GKOH/QFyMn4anD4a3ABgED0DvK91wv/+GJw+GNw+GZ/+GHiAGDbcCLQ1wsDqTgA3CHHANwh0x8h3SHBAyKCEP////28sZNb8jzgAfAB+EdukzDyPN4=",
}

module.exports = { HelloEventsContract }