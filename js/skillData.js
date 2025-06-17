// Dados das skills: id, imagem, requisito, custo e descrição
const skillData = [{
    id: 'Root',
    image: './image/root.png',
    requires: null,
    cost: 0,
    description: 'The beggining'
}, // Level 1 skills
{
    id: 'Skills 1',
    image: './image/DNASkill.png',
    requires: 'Root',
    cost: 100,
    description: '2x skill points spawn chance.'
}, {
    id: 'Life 1',
    image: './image/shield.png',
    requires: 'Root',
    cost: 500,
    description: '+1 Extra Shield.'
}, {
    id: 'Red 1',
    image: './image/red.png',
    requires: 'Root',
    cost: 20,
    description: 'Set Red Max Speed 15.'
}, {
    id: 'Purple 1',
    image: './image/purple.png',
    requires: 'Root',
    cost: 30,
    description: 'Reduce purple speed by 20%.'
}, {
    id: 'Blue 1',
    image: './image/blue.png',
    requires: 'Root',
    cost: 40,
    description: 'Reduce Blue tail by 10%.'
}, {
    id: 'Shadows 1',
    image: './image/shadow.png',
    requires: 'Root',
    cost: 50,
    description: 'Reduce shadows 7 => 6.'
}, {
    id: 'Yellow 1',
    image: './image/yellow.png',
    requires: 'Root',
    cost: 60,
    description: 'Its not working for now.'
}, {
    id: 'Orange 1',
    image: './image/orange.png',
    requires: 'Root',
    cost: 70,
    description: 'Its not working for now.'
}, {
    id: 'Minimizer 1',
    image: './image/minimizer.png',
    requires: 'Root',
    cost: 80,
    description: 'Its not working for now.'
}, {
    id: 'Meteor 1',
    image: './image/meteor.png',
    requires: 'Root',
    cost: 90,
    description: 'Its not working for now.'
}, {
    id: 'Move 1',
    image: './image/move.png',
    requires: 'Root',
    cost: 100,
    description: 'Its not working for now.'
},
// Level 2 skills
{
    id: 'Skills 2',
    image: './image/DNASkill.png',
    requires: 'Skills 1',
    cost: 300,
    description: '3x skill points spawn chance.'
}, {
    id: 'Red 2',
    image: './image/red.png',
    requires: 'Red 1',
    cost: 40,
    description: 'Set Red Max Speed 14.'
}, {
    id: 'Purple 2',
    image: './image/purple.png',
    requires: 'Purple 1',
    cost: 60,
    description: 'Reduce purple speed by 40%.'
}, {
    id: 'Blue 2',
    image: './image/blue.png',
    requires: 'Blue 1',
    cost: 80,
    description: 'Reduce Blue tail by 20%.'
}, {
    id: 'Shadows 2',
    image: './image/shadow.png',
    requires: 'Shadows 1',
    cost: 100,
    description: 'Reduce shadows 6 => 5.'
}, {
    id: 'Yellow 2',
    image: './image/yellow.png',
    requires: 'Yellow 1',
    cost: 120,
    description: 'Its not working for now.'
}, {
    id: 'Orange 2',
    image: './image/orange.png',
    requires: 'Orange 1',
    cost: 140,
    description: 'Its not working for now.'
}, {
    id: 'Minimizer 2',
    image: './image/minimizer.png',
    requires: 'Minimizer 1',
    cost: 160,
    description: 'Its not working for now.'
}, {
    id: 'Meteor 2',
    image: './image/meteor.png',
    requires: 'Meteor 1',
    cost: 180,
    description: 'Its not working for now.'
}, {
    id: 'Move 2',
    image: './image/move.png',
    requires: 'Move 1',
    cost: 200,
    description: 'Its not working for now.'
}, // Level 3 skills
{
    id: 'Skills 3',
    image: './image/DNASkill.png',
    requires: 'Skills 2',
    cost: 900,
    description: '4x skill points spawn chance.'
}, {
    id: 'Red 3',
    image: './image/red.png',
    requires: 'Red 2',
    cost: 80,
    description: 'Set Red Max Speed 13'
}, {
    id: 'Purple 3',
    image: './image/purple.png',
    requires: 'Purple 2',
    cost: 120,
    description: 'Reduce purple speed by 50%.'
}, {
    id: 'Blue 3',
    image: './image/blue.png',
    requires: 'Blue 2',
    cost: 160,
    description: 'Reduce Blue tail by 30%.'
}, {
    id: 'Shadows 3',
    image: './image/shadow.png',
    requires: 'Shadows 2',
    cost: 200,
    description: 'Reduce shadows 5 => 4.'
}, {
    id: 'Yellow 3',
    image: './image/yellow.png',
    requires: 'Yellow 2',
    cost: 240,
    description: 'Its not working for now.'
}, {
    id: 'Orange 3',
    image: './image/orange.png',
    requires: 'Orange 2',
    cost: 280,
    description: 'Its not working for now.'
}, {
    id: 'Minimizer 3',
    image: './image/minimizer.png',
    requires: 'Minimizer 2',
    cost: 320,
    description: 'Its not working for now.'
}, {
    id: 'Meteor 3',
    image: './image/meteor.png',
    requires: 'Meteor 2',
    cost: 360,
    description: 'Its not working for now.'
}, {
    id: 'Move 3',
    image: './image/move.png',
    requires: 'Move 2',
    cost: 400,
    description: 'Its not working for now.'
}, ];

export default skillData;
