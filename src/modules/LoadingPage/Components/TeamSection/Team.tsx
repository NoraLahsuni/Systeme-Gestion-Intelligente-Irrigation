import { Group, Avatar, Text, Title ,  Container, Grid } from '@mantine/core';
import { PhoneCall, Mail } from 'lucide-react';
import classes from './Team.module.css';
import Nora from './Nora.jpg';
import Alaeddine from './alae.jpeg';
import Abdelghani from './abdelghani.jpeg';

export function Team() {
  return (
    <Container py={40} size="xl" className={classes.section}>
        <Title order={2} className={classes.sectionTitle} ta="center" mb={30}>
          Notre équipe
        </Title>
        
        <Grid 
            justify="center"
            gutter="xl"
            styles={{
                inner: {
                    justifyContent: 'center',
                }
            }}  
        >
            <Grid.Col key={1} span={{ base: 12, sm: 6, md: 6 , xl: 4 }}>
                <Group wrap='nowrap' justify="center">
                    <Avatar
                        src={Alaeddine}
                        size={94}
                        radius="md"
                    />
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                            Développeur Logiciel <br /> Embarqué
                        </Text>
                        <Text fz="lg" fw={500} className={classes.name}>
                            Alaeddine Bara
                        </Text>
                        <Group wrap="nowrap" gap={10} mt={3}>
                            <Mail size={16} className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                baraaladine@gmail.com
                            </Text>
                        </Group>
                            <Group wrap="nowrap" gap={10} mt={5}>
                            <PhoneCall size={16} className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                +212 6 82 69 32 64
                            </Text>
                        </Group>
                    </div>
                </Group>
            </Grid.Col>

            <Grid.Col key={3} span={{ base: 12, sm: 6, md: 6 , xl: 4  }}>
                <Group wrap="nowrap" justify="center">
                <Avatar
                    src={Nora}
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        Développeur Logiciel <br /> Embarqué
                    </Text>
                    <Text fz="lg" fw={500} className={classes.name}>
                        Nora Lahsuni
                    </Text>
                    <Group wrap="nowrap" gap={10} mt={3}>
                        <Mail size={16} className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            noralahsuni@gmail.com
                        </Text>
                    </Group>
                        <Group wrap="nowrap" gap={10} mt={5}>
                        <PhoneCall size={16} className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            +212 7 72 15 14 66
                        </Text>
                    </Group>
                </div>
                </Group>
            </Grid.Col>

            <Grid.Col key={2} span={{ base: 12, sm: 6, md: 6 , xl: 4 }} >
                <Group wrap="nowrap" justify="center">
                <Avatar
                    src={Abdelghani}
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        Développeur Logiciel <br /> Embarqué
                    </Text>
                    <Text fz="lg" fw={500} className={classes.name}>
                        Abdelghani Amejoud
                    </Text>
                    <Group wrap="nowrap" gap={10} mt={3}>
                        <Mail size={16} className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            abdelghaniamejoud@gmail.com
                        </Text>
                    </Group>
                        <Group wrap="nowrap" gap={10} mt={5}>
                        <PhoneCall size={16} className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            +212 6 24 23 43 05
                        </Text>
                    </Group>
                </div>
                </Group>
            </Grid.Col>

            <Grid.Col key={4} span={{ base: 12, sm: 6, md: 6 , xl: 4 }}>
                <Group wrap="nowrap" justify="center">
                <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    Développeur Logiciel <br /> Embarqué
                    </Text>
                    <Text fz="lg" fw={500} className={classes.name}>
                        Youssef Amzil
                    </Text>
                    <Group wrap="nowrap" gap={10} mt={3}>
                        <Mail size={16} className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                        Youssef.amzil.90@edu.uiz.ac.ma
                        </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                        <PhoneCall size={16} className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            +212 6 44 88 77 30
                        </Text>
                    </Group>
                </div>
                </Group>
            </Grid.Col>
        </Grid>
    </Container>
  );
}