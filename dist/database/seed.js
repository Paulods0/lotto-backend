"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const areasData = [
    { name: "a" },
    { name: "b" },
    { name: "c" },
    { name: "d" },
];
async function seedData() {
    try {
        await prisma.province.createMany({
            data: [
                { name: "luanda" },
                { name: "benguela" },
                { name: "huambo" },
                { name: "malanje" },
                { name: "cunene" },
                { name: "moxico" },
                { name: "bié" },
                { name: "kwanza norte" },
                { name: "kwanza sul" },
                { name: "cuando cubango" },
                { name: "huíla" },
                { name: "uíge" },
                { name: "lunda norte" },
                { name: "lunda sul" },
            ]
        });
        await prisma.area.createMany({
            data: areasData,
            skipDuplicates: true
        });
        // await prisma.zone.createMany({
        //         data: [
        //             { number: 1, area_id:"66fe82f4-866a-4616-b76a-9cf01ec02292"},
        //             { number: 2, area_id:"66fe82f4-866a-4616-b76a-9cf01ec02292"},
        //             { number: 3, area_id:"66fe82f4-866a-4616-b76a-9cf01ec02292"},
        //             { number: 4, area_id:"66fe82f4-866a-4616-b76a-9cf01ec02292"},
        //             { number: 5, area_id:"f0ea6124-86d9-433b-b754-a2d8217052a4"},
        //             { number: 6, area_id:"f0ea6124-86d9-433b-b754-a2d8217052a4"},
        //             { number: 7, area_id:"f0ea6124-86d9-433b-b754-a2d8217052a4"},
        //             { number: 8, area_id:"f0ea6124-86d9-433b-b754-a2d8217052a4"},
        //             { number: 9, area_id:"6f745805-868a-4e23-8da4-83f3c039d4d3"},
        //             { number: 10, area_id:"6f745805-868a-4e23-8da4-83f3c039d4d3"},
        //             { number: 11, area_id:"6f745805-868a-4e23-8da4-83f3c039d4d3"},
        //             { number: 12, area_id:"6f745805-868a-4e23-8da4-83f3c039d4d3"},
        //             { number: 13, area_id:"6003fbc1-c069-4c4e-b45d-cb31c907a8c9"},
        //             { number: 14, area_id:"6003fbc1-c069-4c4e-b45d-cb31c907a8c9"},
        //             { number: 15, area_id:"6003fbc1-c069-4c4e-b45d-cb31c907a8c9"},
        //             { number: 16, area_id:"6003fbc1-c069-4c4e-b45d-cb31c907a8c9"},
        //         ]
        // })
        // await prisma.subtype.createMany({
        //         data: [
        //             { type_id:"783d7568-39fe-4fa4-8e24-c546498d36ab", name: "arreiou"},
        //             { type_id:"783d7568-39fe-4fa4-8e24-c546498d36ab", name: "kibabo"},
        //             { type_id:"783d7568-39fe-4fa4-8e24-c546498d36ab", name: "nossa casa"},
        //             { type_id:"783d7568-39fe-4fa4-8e24-c546498d36ab", name: "comércio"},
        //             { type_id:"783d7568-39fe-4fa4-8e24-c546498d36ab", name: "agência"},
        //             { type_id:"472a82b9-bf19-45a0-b42b-3a379ef23682", name: "bancada"},
        //             { type_id:"472a82b9-bf19-45a0-b42b-3a379ef23682", name: "roulote"},
        //         ],
        // })
        await prisma.type.createMany({
            data: [
                { name: "ambulante" },
                { name: "comercio" },
                { name: "popup-kit" },
                { name: "quiosque" },
            ],
        });
        console.log("Database seeded successfuly.");
    }
    catch (error) {
        console.error("Error while generate seed.");
    }
}
seedData();
