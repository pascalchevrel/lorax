/**
 * @fileOverview Experience directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * directive
     */
    var ExperienceDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            controller: ExperienceCtrl,
            link: ExperienceLinkFn,
            templateUrl: '/app/lorax/directives/experience.tpl.html'
        };
    };

    /**
     * Controller
     * @constructor
     */
    var ExperienceCtrl = function (
        $scope,
        experienceService,
        routesService,
        dataService,
        windowService
        )
    {
        this._$scope = $scope;
        this._experienceService = experienceService;
        this._routesService = routesService;
        this._dataService = dataService;
        this._windowService = windowService;

        this._$scope = $scope;
        this._$scope.experience = {
            currentView: 'ecosystem',
            isOpen: false,
            isSmall: true
        };

        this._dataService.getMain().then( function (model) {
            this._$scope.experience.localeData = model.getMiscLocale();
        }.bind(this));

        // listen to route change
        this._routesService.subscribe('change', this.onRouteChange.bind(this));
        if (this._routesService.page) {
            this.onRouteChange();
        }

        this._windowService.subscribe('breakpoint', this.onBreakpointChange.bind(this));
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ExperienceCtrl.$inject = [
        '$scope',
        'experienceService',
        'routesService',
        'dataService',
        'windowService'
    ];

    ExperienceCtrl.prototype.switchView = function (view) {
        this._$scope.experience.isSmall = this._windowService.breakpoint() === 'small';
        if (view === 'ecosystem' &&  this._$scope.experience.isSmall) {
            view = 'vitals';
        }
        this._$scope.experience.isOpen = view !== 'detail';
        this._$scope.experience.currentView = view;
        this._experienceService.switchView(view);
    };

    ExperienceCtrl.prototype.onRouteChange = function () {
        if (this._routesService.page === 'detail') {
            this.switchView('detail');
        } else if (this._routesService.page === 'experience') {
            if (this._routesService.params.tag) {
                this._experienceService.switchView('tag', this._routesService.params.tag);
            } else {
                this.switchView(this._routesService.params.mode || 'ecosystem');
            }
        }
    };

    ExperienceCtrl.prototype.onBreakpointChange = function (breakpoint) {
        this._$scope.experience.isSmall = breakpoint === 'small';
    };

    /**
     * Link function
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ExperienceLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._experienceService.setContainer($('#experience-canvas', iElem));
    };

    return ExperienceDirective;
});
