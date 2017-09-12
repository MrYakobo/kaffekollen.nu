<template>
    <div :class="['dropdown', active ? 'is-active' : '']">
        <div class="dropdown-trigger">
            <button class="button" @click="active = !active" aria-haspopup="true" aria-controls="dropdown-menu">
        <span>Dropdown button</span>
        <span class="icon is-small"><i class="fa fa-angle-down" aria-hidden="true"></i></span>
    </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a href="#" class="dropdown-item">
                    Postnummer
                </a>
                <a class="dropdown-item">
                    Stad
                </a>
                <a href="#" class="dropdown-item is-active">
                    Gata
                </a>
                <a href="#" class="dropdown-item">
        Other dropdown item
                </a>
                <hr class="dropdown-divider">
                <a href="#" class="dropdown-item">
        With a divider
      </a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                active: false
            }
        }
    }
</script>