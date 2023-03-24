<template>
    <ResizablePanel>
        <template v-slot:panel1>

            <TreeView :items="treeViewItems"></TreeView>

        </template>
        <template v-slot:panel2>

        </template>
    </ResizablePanel>
</template>

<script setup>
import ResizablePanel from "@studio/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@studio/components/treeview/TreeView.vue"
import {useZkoLoaderStore} from "@zernikalos/store/src";
import {ZObject} from "@zernikalos/exporter";
import {onMounted, ref} from "vue";

const mrrStore = useZkoLoaderStore()
const treeViewItems = ref([])

function convertToHierarchy(obj) {
    if (!obj) {
        return []
    }
    const result = {
        name: ` ${obj.name}`,
        icon: typesIcons[obj.type]
    }
    result.children = obj.children.map((c) => convertToHierarchy(c))
    return result
}

const typesIcons = {
    "Scene": "bi-map", //bi-aspect-ratio
    "Group": "bi-layout-wtf",
    "Model": "bi-box"
}

onMounted(() => {
    treeViewItems.value.splice(0)
    // treeViewItems.value.push(convertToHierarchy(mrrStore.root))
    treeViewItems.value.push(sample)

})

const sample = {
    "name": " Root_Scene",
    "icon": "bi-layout-wtf",
    "children": [
        {
            "name": " RootNode",
            "icon": "bi-layout-wtf",
            "children": [
                {
                    "name": " RobotArmature",
                    "icon": "bi-layout-wtf",
                    "children": [
                        {
                            "name": " Bone",
                            "icon": "bi-layout-wtf",
                            "children": [
                                {
                                    "name": " FootL",
                                    "icon": "bi-layout-wtf",
                                    "children": [
                                        {
                                            "name": " FootL_1",
                                            "icon": "bi-box",
                                            "children": []
                                        },
                                        {
                                            "name": " FootL_end",
                                            "icon": "bi-layout-wtf",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "name": " Body",
                                    "icon": "bi-layout-wtf",
                                    "children": [
                                        {
                                            "name": " Torso",
                                            "icon": "bi-layout-wtf",
                                            "children": [
                                                {
                                                    "name": " Torso_2",
                                                    "icon": "bi-box",
                                                    "children": []
                                                },
                                                {
                                                    "name": " Torso_3",
                                                    "icon": "bi-box",
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": " Hips",
                                            "icon": "bi-layout-wtf",
                                            "children": [
                                                {
                                                    "name": " Abdomen",
                                                    "icon": "bi-layout-wtf",
                                                    "children": [
                                                        {
                                                            "name": " Torso_1",
                                                            "icon": "bi-layout-wtf",
                                                            "children": [
                                                                {
                                                                    "name": " Neck",
                                                                    "icon": "bi-layout-wtf",
                                                                    "children": [
                                                                        {
                                                                            "name": " Head",
                                                                            "icon": "bi-layout-wtf",
                                                                            "children": [
                                                                                {
                                                                                    "name": " Head_1",
                                                                                    "icon": "bi-layout-wtf",
                                                                                    "children": [
                                                                                        {
                                                                                            "name": " Head_2",
                                                                                            "icon": "bi-box",
                                                                                            "children": []
                                                                                        },
                                                                                        {
                                                                                            "name": " Head_3",
                                                                                            "icon": "bi-box",
                                                                                            "children": []
                                                                                        },
                                                                                        {
                                                                                            "name": " Head_4",
                                                                                            "icon": "bi-box",
                                                                                            "children": []
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "name": " Head_end",
                                                                                    "icon": "bi-layout-wtf",
                                                                                    "children": []
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "name": " ShoulderL",
                                                                    "icon": "bi-layout-wtf",
                                                                    "children": [
                                                                        {
                                                                            "name": " ShoulderL_1",
                                                                            "icon": "bi-box",
                                                                            "children": []
                                                                        },
                                                                        {
                                                                            "name": " UpperArmL",
                                                                            "icon": "bi-layout-wtf",
                                                                            "children": [
                                                                                {
                                                                                    "name": " ArmL",
                                                                                    "icon": "bi-box",
                                                                                    "children": []
                                                                                },
                                                                                {
                                                                                    "name": " LowerArmL",
                                                                                    "icon": "bi-layout-wtf",
                                                                                    "children": [
                                                                                        {
                                                                                            "name": " Palm2L",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " Middle1L",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Middle2L",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": [
                                                                                                                {
                                                                                                                    "name": " Middle2L_end",
                                                                                                                    "icon": "bi-layout-wtf",
                                                                                                                    "children": []
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "name": " ThumbL",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " Thumb2L",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Thumb2L_end",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": []
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "name": " Palm1L",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " IndexL",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Index2L",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": [
                                                                                                                {
                                                                                                                    "name": " Index2L_end",
                                                                                                                    "icon": "bi-layout-wtf",
                                                                                                                    "children": []
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "name": " Palm3L",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " Ring1L",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Ring2L",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": [
                                                                                                                {
                                                                                                                    "name": " Ring2L_end",
                                                                                                                    "icon": "bi-layout-wtf",
                                                                                                                    "children": []
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "name": " ShoulderR",
                                                                    "icon": "bi-layout-wtf",
                                                                    "children": [
                                                                        {
                                                                            "name": " ShoulderR_1",
                                                                            "icon": "bi-box",
                                                                            "children": []
                                                                        },
                                                                        {
                                                                            "name": " UpperArmR",
                                                                            "icon": "bi-layout-wtf",
                                                                            "children": [
                                                                                {
                                                                                    "name": " ArmR",
                                                                                    "icon": "bi-box",
                                                                                    "children": []
                                                                                },
                                                                                {
                                                                                    "name": " LowerArmR",
                                                                                    "icon": "bi-layout-wtf",
                                                                                    "children": [
                                                                                        {
                                                                                            "name": " Palm2R",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " Middle1R",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Middle2R",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": [
                                                                                                                {
                                                                                                                    "name": " Middle2R_end",
                                                                                                                    "icon": "bi-layout-wtf",
                                                                                                                    "children": []
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "name": " ThumbR",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " Thumb2R",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Thumb2R_end",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": []
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "name": " Palm1R",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " IndexR",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Index2R",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": [
                                                                                                                {
                                                                                                                    "name": " Index2R_end",
                                                                                                                    "icon": "bi-layout-wtf",
                                                                                                                    "children": []
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "name": " Palm3R",
                                                                                            "icon": "bi-layout-wtf",
                                                                                            "children": [
                                                                                                {
                                                                                                    "name": " Ring1R",
                                                                                                    "icon": "bi-layout-wtf",
                                                                                                    "children": [
                                                                                                        {
                                                                                                            "name": " Ring2R",
                                                                                                            "icon": "bi-layout-wtf",
                                                                                                            "children": [
                                                                                                                {
                                                                                                                    "name": " Ring2R_end",
                                                                                                                    "icon": "bi-layout-wtf",
                                                                                                                    "children": []
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "name": " UpperLegL",
                                            "icon": "bi-layout-wtf",
                                            "children": [
                                                {
                                                    "name": " LegL",
                                                    "icon": "bi-box",
                                                    "children": []
                                                },
                                                {
                                                    "name": " LowerLegL",
                                                    "icon": "bi-layout-wtf",
                                                    "children": [
                                                        {
                                                            "name": " LowerLegL_1",
                                                            "icon": "bi-box",
                                                            "children": []
                                                        },
                                                        {
                                                            "name": " LowerLegL_end",
                                                            "icon": "bi-layout-wtf",
                                                            "children": []
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "name": " UpperLegR",
                                            "icon": "bi-layout-wtf",
                                            "children": [
                                                {
                                                    "name": " LegR",
                                                    "icon": "bi-box",
                                                    "children": []
                                                },
                                                {
                                                    "name": " LowerLegR",
                                                    "icon": "bi-layout-wtf",
                                                    "children": [
                                                        {
                                                            "name": " LowerLegR_1",
                                                            "icon": "bi-box",
                                                            "children": []
                                                        },
                                                        {
                                                            "name": " LowerLegR_end",
                                                            "icon": "bi-layout-wtf",
                                                            "children": []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": " PoleTargetL",
                                    "icon": "bi-layout-wtf",
                                    "children": [
                                        {
                                            "name": " PoleTargetL_end",
                                            "icon": "bi-layout-wtf",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "name": " FootR",
                                    "icon": "bi-layout-wtf",
                                    "children": [
                                        {
                                            "name": " FootR_1",
                                            "icon": "bi-box",
                                            "children": []
                                        },
                                        {
                                            "name": " FootR_end",
                                            "icon": "bi-layout-wtf",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "name": " PoleTargetR",
                                    "icon": "bi-layout-wtf",
                                    "children": [
                                        {
                                            "name": " PoleTargetR_end",
                                            "icon": "bi-layout-wtf",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": " HandR",
                    "icon": "bi-layout-wtf",
                    "children": [
                        {
                            "name": " HandR_1",
                            "icon": "bi-box",
                            "children": []
                        },
                        {
                            "name": " HandR_2",
                            "icon": "bi-box",
                            "children": []
                        }
                    ]
                },
                {
                    "name": " HandL",
                    "icon": "bi-layout-wtf",
                    "children": [
                        {
                            "name": " HandL_1",
                            "icon": "bi-box",
                            "children": []
                        },
                        {
                            "name": " HandL_2",
                            "icon": "bi-box",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
}


</script>

<style scoped>

</style>
