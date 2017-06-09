<style lang="css">
    .advancedSearchBox {
        display: block;
        position: relative;
        margin: 5px 0 10px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        min-height: 40px;
        padding: 0 9px;
        background-color: #fff;
        cursor: text;
        line-height: 38px;
    }

    .advancedSearchBox.active {
        border-color: #66afe9;
    }

    .advancedSearchBox .search-icon {
        float: right;
        padding: 10px 0 0 10px;
    }

    .advancedSearchBox .remove-all-icon {
        float: right;
        padding: 10px 0 0 10px;
        cursor: pointer;
    }

    .advancedSearchBox .search-parameter {
        display: inline-block;
        height: 24px;
        margin: 0 7px 0 0;
        background-color: #5bc0de;
        padding: 0 5px;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        line-height: 24px;
        cursor: default;
        transition: box-shadow 100ms linear;
    }

    .advancedSearchBox .search-parameter:hover {
        box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
    }

    .advancedSearchBox .search-parameter div {
        float: left;
        margin: 0 2px;
    }

    .advancedSearchBox .search-parameter .remove {
        color: #fff;
        margin-left: 5px;
        cursor: pointer;
    }

    .advancedSearchBox .search-parameter .key {
        color: #fff;
    }

    .advancedSearchBox .search-parameter .value span {
        color: #fff;
    }

    .advancedSearchBox .search-parameter .value input {
        height: 24px;
    }

    .advancedSearchBox .search-parameter-input {
        display: inline-block;
        width: auto;
        height: 24px;
        border: 0;
        margin: 0;
        padding: 0;
    }

    .advancedSearchBox .search-parameter-input:focus {
        box-shadow: none;
        outline: none;
    }

    .advancedSearchBox .search-parameter-suggestions {
        cursor: auto;
        display: block;
    }

    .advancedSearchBox .search-parameter-suggestions .title {
        display: inline-block;
        /*float: left;*/
        height: 25px;
        margin: 7px 7px 0 0;
        background-color: transparent;
        color: #888;
        font-weight: bold;
        padding: 0 5px;
        font-size: 14px;
        line-height: 25px;
    }

    .advancedSearchBox .search-parameter-suggestions .search-parameter {
        cursor: pointer;
        background-color: #bdbdbd;
        color: #fff;
    }
</style>
<template>
    <div>
    <div class="advancedSearchBox" :class="advancedSearchBoxClass"
         @click="!focus ? setFocusFor('searchbox') : null">
        <span v-show="searchParams.length < 1 && searchQuery.length === 0"
              class="search-icon glyphicon glyphicon-search"></span>
        <a href="#" v-show="searchParams.length > 0 || searchQuery.length > 0" @click="removeAll()" role="button">
            <span class="remove-all-icon glyphicon glyphicon-trash"></span>
        </a>
        <div>
            <div class="search-parameter" v-for="(searchParam, $index) in searchParams">
                <a href="#" @click="removeSearchParam($index)" role="button">
                    <span class="remove glyphicon glyphicon-trash"></span>
                </a>
                <div class="key" v-bind:key="searchParam.key" @click="enterEditMode($event, $index)">
                    {{searchParam.name}}:

                </div>
                <div class="value">
                    <span v-show="!searchParam.editMode"
                          @click="enterEditMode($event, $index)">{{searchParam.value}}</span>
                    <!--
                           set-focus-on="{{'searchParam:' + searchParam.key}}"
                           uib-typeahead="suggestedValue for suggestedValue in searchParam.suggestedValues | filter:$viewValue"
                           typeahead-min-length="0"
                           typeahead-on-select="searchParamTypeaheadOnSelect($item, searchParam)"
                           typeahead-editable="searchParam.restrictToSuggestedValues !== true"
                           typeahead-select-on-exact="true"
                           typeahead-select-on-blur="searchParam.restrictToSuggestedValues !== true ? false : true"
                           @change="searchParam.restrictToSuggestedValues !== true ? searchParamValueChanged(searchParam) : null"
                           @focus="onSearchParamFocus(searchparam)"
                    -->
                    <input name="value"
                           type="searchParam.type"
                           nit-auto-size-input
                           @keydown="keydown($event, $index)"
                           @blur="leaveEditMode($event, $index)"
                           v-show="searchParam.editMode"
                           v-model="searchParam.value"
                           :placeholder="searchParam.placeholder"/>
                </div>
            </div>
            <!--
                   uib-typeahead="parameter as parameter.name for parameter in parameters | filter:isUnsedParameter | filter:{name:$viewValue} | limitTo:parametersDisplayLimit"
                   typeahead-on-select="searchQueryTypeaheadOnSelect($item, $model, $label)"
                   @change="searchQueryChanged(searchQuery)"
            -->
            <input name="searchbox"
                   class="search-parameter-input"
                   type="text"
                   nit-auto-size-input
                   set-focus-on="searchbox"
                   @keydown="keydown($event)"
                   :placeholder="placeholder"
                   @focus="onSearchFocus"
                   @blur="focus = false"
                   v-model="searchQuery"/>
        </div>
        <div class="search-parameter-suggestions" v-show="parameters.length && focus">
            <span class="title">{{parametersLabel}}:</span>
            <!--
                  v-for="param in parameters | filter:isUnsedParameter | limitTo:parametersDisplayLimit"
            -->
            <span class="search-parameter"
                  v-for="param in parameters"
                  v-bind:key="param.key"
                  v-show="mayShowParam(param)"
                  @mousedown="addSearchParam(param, undefined, true)">
                {{param.name}}
                <i :class="searchParameterSuggestions"></i>
            </span>
        </div>
    </div>
        <!-- hide -->
        <div style="display: none;">
            <typeahead
                    name="typeahead-vue"
                    class="dropdown open"
                    placeholder="Enter query here"
                    :items="items"
                    :query="query"
                    @on-query="getInfoData"
                    @on-select="selectInfoData"
                    :min="2"
                    :debounce="400">
                <a>
                   <!-- <span v-html="(item.info1 + ' : ' +  item.info2) | highlight query"></span>-->
                </a>
            </typeahead>
        </div>
    <div>
        {{ model | stringify }}
    </div>
</div>
</template>
<script type="text/babel">
    import _ from 'lodash'
//    import VueTypeahead from 'vue-typeahead'
//    import typeahead from 'vuejs-typeahead';
    import 'bootstrap/dist/css/bootstrap.min.css'

    const DEFAULT_PARAMS = {
        key: '',
        name: '',
        type: '',
        placeholder: '',
        editMode: false,
        restrictToSuggestedValues: false,
        suggestedValues: [],
        allowMultiple: false,
        index: '',
    };

    const extendDefaultParams = (param) => {
        return _.chain(DEFAULT_PARAMS)
            .cloneDeep()
            .extend(param)
            .value()
    };
    export default {
//        components: {typeahead},
        props: {
            parameters: {
                type: Array,
                default() {
                    return [
                        extendDefaultParams({key: "name", name: "Name", placeholder: "Name..."}),
                        extendDefaultParams({key: "age", name: "Age", placeholder: "Age..."}),
                        extendDefaultParams({
                            key: "city",
                            name: "City",
                            placeholder: "City...",
                            restrictToSuggestedValues: true,
                            suggestedValues: ['Berlin', 'London', 'Paris']
                        }),
                        extendDefaultParams({
                            key: "email",
                            name: "E-Mail",
                            placeholder: "E-Mail...",
                            allowMultiple: true
                        }),
                    ]
                }
            },
            model: {
                type: Object,
                default() {
                    return {}
                }
            },
            searchThrottleTime: {
                type: Number,
                default() {
                    return 1000
                }
            },
            parametersDisplayLimit: {
                type: Number,
                default() {
                    return 8
                }
            },
            parametersLabel: {
                type: String,
                default() {
                    return 'Parameter Suggestions'
                }
            },
            placeholder: {
                type: String,
                default() {
                    return 'Search ...'
                }
            }
        },
        data() {
            return {
                focus: false,
                searchParams: [],
                searchQuery: [],

                // type-ahead
                items: ['yyy','zzz'],
                query: 'x',
                selected : null
            }
        },
        created(){
            console.log('created', this);
            this.searchThrottleTimer = 0;
            this.changeBuffer = [];
        },
        filters: {
            stringify(value){
                return JSON.stringify(value)
            }
        },
        methods: {
            getInfoData(query){
//                this.$http.get('api/search', {q : query}).then(
//                    ({data})=>{
//                        this.items = data; // data expected to be an array
//                    },
//                    (err)=>{
//                        this.items = []
//                    }
//                );

                console.log('query', query)
            },
            selectInfoData(selectedObj, selectedIdx){
                console.log('selectedObj', selectedObj)
                this.selected = selectedObj;
                //this.selected = this.items[selectedIdx];
            },
            // ---

            setFocusFor(id) {
                console.log('setFocusFor', id)
            },
            keydown($event, $index) {
            },
            onSearchFocus() {
                console.log('onSearchFocus')
                this.focus = true
            },
            onSearchParamFocus(searchParam) {
                return searchParam.editMode
            },
            addSearchParam(searchParam, value, enterEditModel) {
                let internalIndex = 0;
                if(searchParam.allowMultiple) {
//                    const found = _.find(this.searchParams, (({key}) => searchParam.key === key));
//                    internalIndex = found ? found.length : 0;
                    internalIndex = _.countBy(this.searchParams, (({key}) => searchParam.key === key)).true || 0
                }

                var newIndex =
                    this.searchParams.push(
                        extendDefaultParams({
                            key: searchParam.key,
                            name: searchParam.name,
                            type: searchParam.type || 'text',
                            placeholder: searchParam.placeholder,
                            allowMultiple: searchParam.allowMultiple || false,
                            suggestedValues: searchParam.suggestedValues || [],
                            restrictToSuggestedValues: searchParam.restrictToSuggestedValues || false,
                            index: internalIndex,
                            value: value || ''
                        })
                    ) - 1;
//                let internalIndex = -1;
//                let param = _.find(this.searchParams, (({key}) => (internalIndex++, searchParam.key === key)));
//                if (param.allowMultiple) {
//
//                }
//                this.searchParams[this.searchParams.length - 1].index = internalIndex;

                this.updateModel('add', searchParam.key, internalIndex, value);

                if (enterEditModel) {
                    window.setTimeout(() => {
                        this.enterEditMode(undefined, newIndex);
                    }, 100);
                }
            },
            enterEditMode(e, index) {
                if (e !== undefined)
                    e.stopPropagation();

                if (index === undefined)
                    return;

                let searchParam = this.searchParams[index];
                searchParam.editMode = true;
//                setFocusFor('searchParam:' + searchParam.key);

//                $scope.$emit('advanced-searchbox:enteredEditMode', searchParam);
            },
            leaveEditMode(e, index) {
                if (index === undefined)
                    return;

                let searchParam = this.searchParams[index];
                searchParam.editMode = false;

//                $scope.$emit('advanced-searchbox:leavedEditMode', searchParam);

                // remove empty search params
                if (!searchParam.value)
                    this.removeSearchParam(index);
            },
            searchParamValueChanged(param) {
                console.log('searchParamValueChanged', param)
                this.updateModel('change', param.key, param.index, param.value);
            },
            searchQueryChanged(query) {

                this.updateModel('change', 'query', 0, query);
            },
            removeSearchParam(index) {
                if (index === undefined)
                    return;

                let searchParam = this.searchParams[index];
                this.searchParams.splice(index, 1);

                // reassign internal index
                if (searchParam.allowMultiple) {
//                    var paramsOfSameKey = $filter('filter')(this.searchParams, function (param) { return param.key === searchParam.key; });
                    var paramsOfSameKey = _.filter(this.searchParams, function (param) {
                        return param.key === searchParam.key;
                    })
                    for (var i = 0; i < paramsOfSameKey.length; i++) {
                        paramsOfSameKey[i].index = i;
                    }
                }

                this.updateModel('delete', searchParam.key, searchParam.index);
            },
            updateModel(command, key, index, value) {

                if (this.searchThrottleTimer)
                    window.clearTimeout(this.searchThrottleTimer);

                // remove all previous entries to the same search key that was not handled yet
//                this.changeBuffer = _.filter(this.changeBuffer, function (change) { return change.key === key && change.index === index; });
                // add new change to list
                this.changeBuffer.push({
                    command: command,
                    key: key,
                    index: index,
                    value: value
                });


                this.searchThrottleTimer = window.setTimeout(() => {
                    _.forEach(this.changeBuffer, (change) => {
//                        var searchParam = $filter('filter')($scope.parameters, function (param) { return param.key === key; })[0];
                        let searchParam = _.find(this.parameters, param => param.key === change.key);
                        let model = this.model;
                        if(searchParam && searchParam.allowMultiple){
                            if(!_.isArray(model[change.key]))
                                model[change.key] = [];

                            if(change.command === 'delete'){
                                model[change.key].splice(change.index, 1);
                                if(model[change.key].length === 0)
                                    delete model[change.key];
                            } else {
                                model[change.key][change.index] = change.value;
                            }
                        } else {
                            if(change.command === 'delete')
                                delete model[change.key];
                            else
                                model[change.key] = change.value;
                        }
                    });

                    console.log('model', this.model)
                    this.changeBuffer.length = 0;
                    this.$forceUpdate();
                }, this.searchThrottleTime);
            },
            mayShowParam(param) {
                const searchParam = _.find(this.searchParams, ({key})=> key === param.key);
                return !searchParam || searchParam.allowMultiple
            }
        },
        computed: {
            advancedSearchBoxClass() {
                return {active: this.focus}
            },
            searchParameterSuggestions(param) {
                return {'glyphicon glyphicon-plus': param.allowMultiple}
            }
        },
        watch: {
            searchQuery(val, oldVal) {
                this.searchQueryChanged(val)
            },
            searchParams: {
                handler: function(searchParams) {
                    searchParams.forEach((searchParam) => {
                        if(searchParam/*&& searchParam.restrictToSuggestedValues !== true*/) {
                            this.searchParamValueChanged(searchParam)
                        }
                    })
                },
                deep: true
            }
        }
    }
</script>